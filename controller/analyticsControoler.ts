import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { getnateLast12Month } from "../utils/analytics";
import userModel from "../module/User";
import CourseModel from "../module/Course";
import OrderModel from "../module/Order";

// get user analytics
export const getUSerAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getnateLast12Month(userModel);

      res.status(200).json({ success: true, users });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get course analytics
export const getcourseAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await getnateLast12Month(CourseModel);

      res.status(200).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get order analytics
export const getorderrAnalytics = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await getnateLast12Month(OrderModel);

      res.status(200).json({ success: true, order });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
