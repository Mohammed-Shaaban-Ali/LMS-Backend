import { app } from "./app";
import connectToDb from "./config/connectToDb";
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// cloudinary configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// server running
connectToDb();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT} `);
});
