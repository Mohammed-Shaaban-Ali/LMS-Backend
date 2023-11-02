import express from "express";
import {
  ActivateUser,
  LoginUser,
  LogoutUser,
  getUser,
  registertionToken,
  socialLogin,
  updateAvatar,
  updatePassword,
  updateToken,
  updateUser,
} from "../controller/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getallUsers } from "../services/userService";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);
userRoute.post("/activate-user", ActivateUser);
userRoute.post("/login", LoginUser);
userRoute.post("/login-socialauth", socialLogin);
userRoute.post("/logout", isAuthenticated, LogoutUser);
userRoute.get("/refresh", updateToken);
userRoute.get("/get-login-user", isAuthenticated, getUser);
userRoute.get(
  "/get-all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getallUsers
);
userRoute.put("/update-user-info", isAuthenticated, updateUser);
userRoute.put("/update-user-password", isAuthenticated, updatePassword);
userRoute.put("/update-user-avatar", isAuthenticated, updateAvatar);

export default userRoute;
