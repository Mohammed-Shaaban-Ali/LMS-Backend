import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder } from "../controller/orderController";
const orderRoute = express.Router();

orderRoute.put("/create-order", isAuthenticated, createOrder);
export default orderRoute;
