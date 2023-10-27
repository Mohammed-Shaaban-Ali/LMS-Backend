import express from "express";
import {
  ActivateUser,
  LoginUser,
  registertionToken,
} from "../controller/userController";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);
userRoute.post("/activate-user", ActivateUser);
userRoute.post("/login", LoginUser);

export default userRoute;
