import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import notificationModel from "../module/Notification";
import ErrorHandler from "../utils/ErrorHandler";

// get all notifications
export const getAllNotifications = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificationModel
        .find()
        .sort({ createAt: -1 });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update notification

export const updateNotifications = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel.findById(req.params.id);
      if (!notification)
        return next(new ErrorHandler("Notification not found", 400));
      else
        notification.status
          ? (notification.status = "read")
          : notification.status;

      await notification.save();

      const notifications = await notificationModel
        .find()
        .sort({ createAt: -1 });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
