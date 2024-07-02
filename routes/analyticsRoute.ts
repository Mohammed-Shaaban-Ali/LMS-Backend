import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getUSerAnalytics,
  getcourseAnalytics,
  getorderrAnalytics,
} from "../controller/analyticsControoler";
import { updateToken } from "../controller/userController";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/get-user-analytics",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  getUSerAnalytics
);
analyticsRoute.get(
  "/get-courses-analytics",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  getcourseAnalytics
);
analyticsRoute.get(
  "/get-order-analytics",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  getorderrAnalytics
);

export default analyticsRoute;
