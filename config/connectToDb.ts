const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect To MongoDB ^_^");
  } catch (error) {
    console.log("Connection Failed To MongoDB", error);
  }
};
export default connectToDb;
