import { CatchAsyncErrors } from "./../middleware/catchAsyncErrors";
import userModel, { IUser } from "../module/User";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response, response } from "express";
import Jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendEmail";
import { sendToken } from "../utils/JWT";

// register user
interface IRegistertion {
  name: string;
  email: string;
  password: string;
  avatar?: string;
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
          activationToken: activeToken.token,
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

// active token
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

// active user
interface IActivaionRequst {
  activation_token: string;
  activation_code: string;
}
export const ActivateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivaionRequst;

      const newUser: { user: IUser; activtionCode: string } = Jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRT || ""
      ) as { user: IUser; activtionCode: string };

      if (newUser.activtionCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code ", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exsist ", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
// Login user
interface ILoginUser {
  email: string;
  password: string;
}
export const LoginUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUser;

      if (!email || !password)
        return next(new ErrorHandler("Please enter Email and Password", 400));

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) return next(new ErrorHandler("Email not exsist", 400));

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch)
        return next(new ErrorHandler("Password is wrong", 400));
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
