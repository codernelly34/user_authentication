import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const getUserInfo = expressAsyncHandler(async (req, res) => {
  const id = req.user;

  const user = await userModel
    .findById(id)
    .select("firstName lastName email provider -_id");

  if (!user) {
    throw new AppError(
      "Unable to get User info, Please try again later",
      500,
      "ServerError"
    );
  }

  res.status(200).json(user);
});

export default getUserInfo;
