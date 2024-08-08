import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrdersadmin } from "../controller/orderController";
import { updateToken } from "../controller/userController";
const orderRoute = express.Router();

orderRoute.put("/create-order", updateToken, isAuthenticated, createOrder);
orderRoute.get(
  "/get-all-orders",
  updateToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdersadmin
);
export default orderRoute;
