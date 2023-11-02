import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrdersadmin } from "../controller/orderController";
const orderRoute = express.Router();

orderRoute.put("/create-order", isAuthenticated, createOrder);
orderRoute.put(
  "/get-all-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersadmin
);
export default orderRoute;
