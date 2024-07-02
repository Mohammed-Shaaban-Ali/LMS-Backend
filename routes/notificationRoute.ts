import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getAllNotifications,
  updateNotifications,
} from "../controller/notificationController";
import { updateToken } from "../controller/userController";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  getAllNotifications
);

notificationRoute.put(
  "/update-notifications/:id",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  updateNotifications
);
export default notificationRoute;
