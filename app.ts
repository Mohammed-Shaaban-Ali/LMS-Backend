const express = require("express");
import { Response, Request } from "express";
export const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// body parser
app.use(express.json({ limit: "50mb" }));

// cookieParser
app.use(cookieParser());

// cors
app.use(cors());
