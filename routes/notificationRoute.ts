import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getAllNotifications,
  updateNotifications,
} from "../controller/notificationController";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllNotifications
);

notificationRoute.put(
  "/update-notifications/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotifications
);
export default notificationRoute;
