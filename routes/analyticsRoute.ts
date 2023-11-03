import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getUSerAnalytics,
  getcourseAnalytics,
  getorderrAnalytics,
} from "../controller/analyticsControoler";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/get-user-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUSerAnalytics
);
analyticsRoute.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getcourseAnalytics
);
analyticsRoute.get(
  "/get-order-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getorderrAnalytics
);

export default analyticsRoute;
