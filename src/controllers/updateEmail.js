import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import { capitalize } from "../utils/utilsFun.js";

const updateEmail = expressAsyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    throw new AppError(
      "Please provide your password and the new email you want to update.",
      400
    );
  }

  const user = await userModel.findById(req.user);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.provider !== "local") {
    throw new AppError(
      `Since your account was created with ${capitalize(user.provider)}, you must first set a password to update your email.`
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect password.", 401);
  }

  const existingUser = await userModel.findOne({ email: newEmail });
  if (existingUser) {
    throw new AppError("The new email you entered is already in use.", 400);
  }

  user.email = newEmail;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Your email has been updated successfully.",
  });
});

export default updateEmail;
