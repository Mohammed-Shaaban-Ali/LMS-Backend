import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "./../middleware/catchAsyncErrors";
import ejs from "ejs";
import path from "path";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../module/Order";
import userModel from "../module/User";
import CourseModel from "../module/Course";
import sendMail from "../utils/sendEmail";
import notificationModel from "../module/Notification";

// create order

export const createOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser)
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 400));

      const data: any = {
        courseId: course._id,
        userId: user?._id,
      };

      const order = await OrderModel.create(data);

      const mailData = {
        order: {
          id: course?._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-mail.ejs"),
        mailData
      );

      try {
        await sendMail({
          email: user?.email || "",
          subject: "Order Confirmation",
          template: "order-mail.ejs",
          data: mailData,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.mesage, 400));
      }

      user?.courses.push(course._id);
      await user?.save();
      await notificationModel.create({
        userId: user?._id,
        title: "New Order",
        message: `You have anew order ${course.name}`,
      });

      res.status(200).json({ success: true, order: course });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
