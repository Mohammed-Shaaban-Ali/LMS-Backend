import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { getnateLast12Month } from "../utils/analytics";
import userModel from "../module/User";

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
