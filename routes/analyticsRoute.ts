import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getUSerAnalytics } from "../controller/analyticsControoler";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/get-user-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUSerAnalytics
);

export default analyticsRoute;
