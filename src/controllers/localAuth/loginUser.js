import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";

import AppError from "../../utils/AppError.js";
import userModel from "../../models/user.model.js";
import issueAuthToken from "../../utils/issueAuthToken.js";

// Sign In
const loginAccount = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.validBody;

  // Return an error if email or password is missing from the request
  if (!email || !password) {
    throw new AppError(
      "Missing required fields: email and/or password.",
      400,
      "MissingFields"
    );
  }

  // Return an error if no user is found with the provided email
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new AppError(
      "User not found with the provided email.",
      404,
      "UserNotFound"
    );
  }

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  if (user && user.provider !== "local") {
    throw new AppError(
      `This email is already registered with ${capitalize(
        user.provider
      )}. Please log in using your ${capitalize(user.provider)} account.`,
      404,
      "UserNotFound"
    );
  }

  // Compare provided password with stored hashed password; return error if they don't match
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(
      "Incorrect password. Please check your credentials and try again.",
      401,
      "InvalidCredentials"
    );
  }

  await issueAuthToken(user, res);

  // Send user’s basic info in the JSON response with HTTP status 200
  const resBody = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  res.status(200).json(resBody);
});

export default loginAccount;
