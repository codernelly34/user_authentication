import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

const addPassword = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const id = req.user;

  const checkUserInDB = await userModel.findById(id);

  if (checkUserInDB.email !== email) {
    throw new AppError(
      "No account found with that email.",
      404,
      "UserNotFound"
    );
  }

  if (checkUserInDB.provider === "local") {
    throw new AppError(
      "You can't add password to your account when you account provider is set to Local, you can only change it",
      400
    );
  }

  // Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // Update password and provider value
  checkUserInDB.provider = "local";
  checkUserInDB.password = hashPassword;
  checkUserInDB.save();

  res.status(200).json({
    message:
      "You account has been updated to have a password you can now login only with your email and password",
    user: {
      firstName: checkUserInDB.firstName,
      lastName: checkUserInDB.lastName,
      email: checkUserInDB.email,
      provider: checkUserInDB.provider,
    },
  });
});

export default addPassword;
