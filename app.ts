const express = require("express");
import { Response, Request, NextFunction } from "express";
import { ErrorMiddlware } from "./middleware/error";
export const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// body parser
app.use(express.json({ limit: "50mb" }));

// cookieParser
app.use(cookieParser());

// cors
app.use(cors());

// unknwon route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Middleware
app.use(ErrorMiddlware);
