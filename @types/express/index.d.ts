import express from "express";
import { IUser } from "../../module/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
