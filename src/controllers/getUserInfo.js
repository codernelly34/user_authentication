import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";

const getUserInfo = expressAsyncHandler(async (req, res) => {
  const email = req.user;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(
      "Unable to get User info, Please try again later",
      500,
      "ServerError"
    );
  }

  const resBody = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  res.status(200).json(resBody);
});

export default getUserInfo;
