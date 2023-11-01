import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { createCourse } from "../services/courseService";
import CourseModel from "../module/Course";
import { redis } from "../utils/redis";
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
        (course: any) => course._id.toString() === courseId
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
