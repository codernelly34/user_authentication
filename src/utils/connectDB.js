import "dotenv/config";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(`${process.env.mongodbURI}/${DB_NAME}`);
    console.log("Successful connecting to DB");
  } catch (err) {
    console.log("Connection to DB head an error");
    process.exit(1);
  }
};

export { connectDB };
