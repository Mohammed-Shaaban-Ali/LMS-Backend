const express = require("express");
import { Response, Request, NextFunction } from "express";
import { ErrorMiddlware } from "./middleware/error";
export const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

import userRoute from "./routes/userRoute";
import courseRoute from "./routes/courseRoute";
import orderRoute from "./routes/orderRoute";
import notificationRoute from "./routes/notificationRoute";
import analyticsRoute from "./routes/analyticsRoute";
import layoutRoute from "./routes/layoutRoute";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookieParser
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000", // specify the origin
  credentials: true, // include credentials (cookies, authentication)
};

app.use(cors(corsOptions));

// routes
app.use("/api", userRoute);
app.use("/api", courseRoute);
app.use("/api", orderRoute);
app.use("/api", notificationRoute);
app.use("/api", analyticsRoute);
app.use("/api", layoutRoute);

// unknwon route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Middleware
app.use(ErrorMiddlware);
