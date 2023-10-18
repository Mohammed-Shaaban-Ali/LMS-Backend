import express from "express";
import { registertionToken } from "../controller/userController";
const userRoute = express.Router();

userRoute.post("/register", registertionToken);

export default userRoute;
