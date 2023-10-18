import { app } from "./app";
import connectToDb from "./config/connectToDb";
require("dotenv").config();

// server running
connectToDb();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT} `);
});


