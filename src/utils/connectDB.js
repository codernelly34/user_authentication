import mongoose from "mongoose";

const uri = process.env.mongodbURI;

const connectDB = async () => {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(uri);
    console.log("Successful connecting to DB");
  } catch (err) {
    console.log("Connection to DB head an error \n");
    console.log(err, "\n");
    process.exit(1);
  }
};

export default connectDB;
