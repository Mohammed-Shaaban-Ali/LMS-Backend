import { NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../module/Order";

// create order
export const newOrder = CatchAsyncErrors(
  async (data: any, next: NextFunction) => {
    const order = await OrderModel.create(data);
    next();
  }
);
