import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
export const ErrorMiddlware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 400;
  err.message = err.message || "Invalid server error";

  // mongodb id error
  if (err.name === "CaseError") {
    const message = `Response not found in ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // deblucate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} extered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expired
  if (err.name === "JsonWebTokenError") {
    const message = `json web token expired, please try again`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === "TokenExpiredError") {
    const message = `json web token expired, please try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    mesage: err.message,
  });
};
