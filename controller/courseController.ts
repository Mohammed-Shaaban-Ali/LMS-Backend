import { NextFunction, Request, Response } from "express";
import ejs from "ejs";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createCourse } from "../services/courseService";
import CourseModel from "../module/Course";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import sendMail from "../utils/sendEmail";
const cloudinary = require("cloudinary");

// upload course
export const uploadCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// edit course
export const editCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.vw.destroy(thumbnail).public_id;
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get single course

export const getSingleCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isachedExists = await redis.get(courseId);
      if (isachedExists) {
        const course = JSON.parse(isachedExists);
        res.status(200).json({ success: true, course });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links "
        );
        await redis.set(courseId, JSON.stringify(course));
        res.status(200).json({ success: true, course });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get all courses

export const getAllCourses = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isachedExists = await redis.get("allCourses");
      if (isachedExists) {
        const courses = JSON.parse(isachedExists);
        res.status(200).json({ success: true, courses });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links "
        );

        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({ success: true, courses });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get courses by user

export const getCoursesByUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coursesList = req.user?.courses;
      const courseId = req.params.id;

      const isExsist = coursesList?.find(
        (course: any) => course._id === courseId
      );
      if (!isExsist) {
        return next(
          new ErrorHandler("You are not enable to access to this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);
      const courseContent = course?.courseData;
      res.status(200).json({ success: true, content: courseContent });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// add questions in course
interface IAddQuestions {
  question: string;
  courseId: string;
  contentId: string;
}
export const addQuestions = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId, courseId, question } = req.body as IAddQuestions;

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      const course = await CourseModel.findById(courseId);
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid contant id", 400));
      }

      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      courseContent.questions.push(newQuestion);

      await course?.save();

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// add answer in course questions

interface IAddAnswer {
  answer: string;
  questionId: string;
  contentId: string;
  courseId: string;
}

export const addAnswer = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId, courseId, questionId, answer } =
        req.body as IAddAnswer;

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      const course = await CourseModel.findById(courseId);
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid contant id", 400));
      }

      const question = courseContent?.questions.find((qui: any) =>
        qui._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // Create a new question
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);
      await course?.save();

      if (req.user?._id === question.user._id) {
        // create notification
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/questions-mail.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "questions-mail.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.mesage, 400));
        }
      }

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// add review in course

interface IAddReview {
  comment: string;
  rating: number;
}
export const addReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, rating } = req.body as IAddReview;

      const userCoursesList = req.user?.courses;
      const courseId = req.params.id;

      const isExsist = userCoursesList?.find(
        (course: any) => course._id === courseId
      );
      if (!isExsist) {
        return next(
          new ErrorHandler("You are not enable to review in this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      const reviewData: any = {
        user: req.user,
        comment,
        rating,
      };

      course?.reviews.push(reviewData);

      // rating
      let ratingSum = 0;
      course?.reviews.forEach((review: any) => {
        ratingSum += review.rating;
      });
      if (course) course.rating = ratingSum / course.reviews.length;

      await course?.save();

      // noitfication
      const notification = {
        title: "New Review",
        massage: `${req.user?.name} has given a review in ${course?.name}`,
      };

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// add replay in course review
interface IReplayReview {
  comment: string;
  reviewId: string;
  courseId: string;
}

export const addReplay = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, reviewId, courseId } = req.body as IReplayReview;

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 400));

      const review = course.reviews.find(
        (r: any) => r._id.toString() === reviewId
      );
      if (!review) return next(new ErrorHandler("Review not found", 400));

      const replayData: any = {
        comment,
        user: req.user,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replayData);

      await course.save();
      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);