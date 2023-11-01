import express from "express";
import {
  ActivateUser,
  LoginUser,
  LogoutUser,
  getUser,
  registertionToken,
  socialLogin,
  updateToken,
  updateUser,
} from "../controller/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);
userRoute.post("/activate-user", ActivateUser);
userRoute.post("/login", LoginUser);
userRoute.post("/login-socialauth", socialLogin);
userRoute.post("/logout", isAuthenticated, LogoutUser);
userRoute.get("/refresh", updateToken);
userRoute.get("/get-login-user", isAuthenticated, getUser);
userRoute.put("/update-user-info", isAuthenticated, updateUser);

export default userRoute;
