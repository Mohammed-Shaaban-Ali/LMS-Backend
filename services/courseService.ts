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
