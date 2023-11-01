require("dotenv").config();

import { redis } from "./redis";
import { Response } from "express";
import { IUser } from "./../module/User";

interface ITokenOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}
const accessTokenRexpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenRexpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

//   options for cookie
export const accessTokenOptions: ITokenOption = {
  expires: new Date(Date.now() + accessTokenRexpire * 60 * 60 * 1000),
  maxAge: accessTokenRexpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOptions: ITokenOption = {
  expires: new Date(Date.now() + refreshTokenRexpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenRexpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  try {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    //   upload session to redis
    redis.set(user._id, JSON.stringify(user) as any);

    if (process.env.NODE_ENV === "production") accessTokenOptions.secure = true;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error: any) {
    console.log(error);
  }
};
