import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import expressAsyncHandler from "express-async-handler";

const updatePassword = expressAsyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;

  if (!password) {
    throw new AppError("Please provide your password", 400);
  }

  const user = await userModel.findById(req.user);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.provider === "local") {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Incorrect password.", 401);
    }

    if (!newPassword) {
      throw new AppError("Enter your new password to update", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Your password has been updated successfully.",
  });
});

export default updatePassword;
