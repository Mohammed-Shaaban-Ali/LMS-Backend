import { CatchAsyncErrors } from "./../middleware/catchAsyncErrors";
import userModel, { IUser } from "../module/User";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
const cloudinary = require("cloudinary");

import sendMail from "../utils/sendEmail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/JWT";
import { redis } from "../utils/redis";
import {
  getUserById,
  getallUsers,
  upadteUserRoleService,
} from "../services/userService";

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

// logout User
export const LogoutUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId);
      res.status(200).json({ success: true, message: "Logout successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update token
export const updateToken = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = "Could not update token";
      const refresh_token = req.cookies.refresh_token as string;

      const decode = Jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      if (!decode) return next(new ErrorHandler(message, 400));

      const session = await redis.get(decode.id as string);
      if (!session) return next(new ErrorHandler(message, 400));

      const user = JSON.parse(session);

      const accessToken = Jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      const refreshToken = Jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d" }
      );

      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({ success: true, accessToken });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get user information
export const getUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id || "";

      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// social login
interface ISocialLogin {
  email: string;
  password: string;
  avatar: string;
}
export const socialLogin = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, avatar } = req.body as ISocialLogin;

      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, password, avatar });
        sendToken(newUser, 200, res);
      } else sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update user information
interface IUpdateuser {
  name?: string;
  email?: string;
}
export const updateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateuser;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);
      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }
      if (name && user) user.name = name;

      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res
        .status(201)
        .json({ success: true, message: "User updated successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update password
interface IUpdateuser {
  oldPassword: string;
  newPassword: string;
}
export const updatePassword = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdateuser;
      const user = await userModel.findById(req.user?._id).select("+password");

      if (!oldPassword || !newPassword)
        return next(
          new ErrorHandler("Please enter Old passsword and New password", 400)
        );

      if (user?.password === undefined)
        return next(new ErrorHandler("Invalid user", 400));

      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch)
        return next(new ErrorHandler("Password is wrong", 400));

      user.password = newPassword;
      await user?.save();
      await redis.set(user._id, JSON.stringify(user));
      res.status(200).json({ user });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update avatar

interface IUpdateuser {
  avatar: string;
}
export const updateAvatar = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);
      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          const myClou = await cloudinary.v2.uploader.upload(avatar, {
            folder: "LMS-avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myClou.public_id,
            url: myClou.secure_url,
          };
        } else {
          const myClou = await cloudinary.v2.uploader.upload(avatar, {
            folder: "LMS-avatars",
            width: 150,
          });
          console.log("1");

          user.avatar = {
            public_id: myClou.public_id,
            url: myClou.secure_url,
          };
        }
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get all users-admin

export const getAllUsers = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getallUsers(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// update user role
export const updateUserRole = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      upadteUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// delete user
export const deleteUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) return next(new ErrorHandler("User not found", 400));

      await user.deleteOne({ id });
      await redis.del(id);

      res
        .status(201)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
