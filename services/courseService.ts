import { Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import CourseModel from "../module/Course";

// create course
export const createCourse = CatchAsyncErrors(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(200).json({ success: true, course });
  }
);
// get all courses

export const getallCoursesadmin = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  res.status(201).json({ success: true, courses });
};
