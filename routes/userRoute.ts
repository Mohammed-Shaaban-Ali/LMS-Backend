import express from "express";
import {
  ActivateUser,
  LoginUser,
  LogoutUser,
  getUser,
  registertionToken,
  updateToken,
} from "../controller/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);
userRoute.post("/activate-user", ActivateUser);
userRoute.post("/login", LoginUser);
userRoute.post("/logout", isAuthenticated, LogoutUser);
userRoute.get("/refresh", updateToken);
userRoute.get("/me", isAuthenticated, getUser);

export default userRoute;
