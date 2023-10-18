import { CatchAsyncErrors } from "./../middleware/catchAsyncErrors";
import userModel from "../module/User";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import Jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendEmail";

// register user
interface IRegistertion {
  name: string;
  email: string;
  password: string;
  avater?: string;
}

export const registertionToken = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistertion = {
        name,
        email,
        password,
      };
      const activeToken = createActiveToken(user);
      const activtionCode = activeToken.activtionCode;

      const data = { user: { name: user.name, activtionCode } };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/Activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "activation email",
          template: "Activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email ${user.email} to activate your account`,
          activtionCode,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.mesage, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

interface IActiveToken {
  token: string;
  activtionCode: string;
}

export const createActiveToken = (user: any): IActiveToken => {
  const activtionCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = Jwt.sign(
    {
      user,
      activtionCode,
    },
    process.env.ACTIVATION_SECRT as Secret,
    { expiresIn: "5m" }
  );

  return { token, activtionCode };
};
