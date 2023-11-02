import { Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../module/Order";

// create order
export const newOrder = CatchAsyncErrors(async (data: any, res: Response) => {
  const order = await OrderModel.create(data);
  res.status(200).json({ success: true, order });
});
