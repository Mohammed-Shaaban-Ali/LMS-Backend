import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayout,
} from "../controller/layoutController";
import { updateToken } from "../controller/userController";

const layoutRoute = express.Router();

layoutRoute.post(
  "/create-layout",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);
layoutRoute.put(
  "/update-layout",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);
layoutRoute.get(
  "/get-layout",

  getLayout
);

export default layoutRoute;
