import express from "express";
import {
  ActivateUser,
  LoginUser,
  LogoutUser,
  deleteUser,
  getUser,
  registertionToken,
  socialLogin,
  updateAvatar,
  updatePassword,
  updateToken,
  updateUser,
  updateUserRole,
} from "../controller/userController";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getallUsers } from "../services/userService";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);
userRoute.post("/activate-user", ActivateUser);
userRoute.post("/login", LoginUser);
userRoute.post("/login-socialauth", socialLogin);
userRoute.get("/logout", updateToken,isAuthenticated, LogoutUser);
userRoute.get("/refresh", updateToken);
userRoute.get("/get-login-user", updateToken,isAuthenticated, getUser);
userRoute.get(
  "/get-all-users",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  getallUsers
);
userRoute.put("/update-user-info", updateToken,isAuthenticated, updateUser);
userRoute.put("/update-user-password", updateToken,isAuthenticated, updatePassword);
userRoute.put("/update-user-avatar", updateToken,isAuthenticated, updateAvatar);
userRoute.put(
  "/update-user-role",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRoute.delete(
  "/delete-user/:id",
  updateToken,isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRoute;
