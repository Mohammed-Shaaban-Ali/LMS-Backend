import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayout,
} from "../controller/layoutController";

const layoutRoute = express.Router();

layoutRoute.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);
layoutRoute.put(
  "/update-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);
layoutRoute.get(
  "/get-layout",

  getLayout
);

export default layoutRoute;
