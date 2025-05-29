import ms from "ms";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

import AppError from "../../utils/AppError.js";
import userModel from "../../models/user.model.js";

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

  // Compare provided password with stored hashed password; return error if they don't match
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(
      "Incorrect password. Please check your credentials and try again.",
      401,
      "InvalidCredentials"
    );
  }

  // Create access and refresh token
  const createAccessToken = jwt.sign({ email }, process.env.accessTokenKey, {
    expiresIn: ms("5m"),
  });
  const createRefreshToken = jwt.sign({ email }, process.env.refreshTokenKey, {
    expiresIn: ms("15m"),
  });

  // Save refresh token to user; throw error if save fails
  try {
    user.token = createRefreshToken;
    user.save();
  } catch (error) {
    throw new AppError(
      "We encounter and error while trying to log you into your account. please try again later",
      500,
      "ServerError",
      error
    );
  }

  // Set access and refresh tokens as secure, HTTP-only cookies with expiration times
  res.cookie("accessToken", createAccessToken, {
    maxAge: ms("5m"),
    httpOnly: true,
    secure: true,
  });
  res.cookie("refreshToken", createRefreshToken, {
    maxAge: ms("15m"),
    httpOnly: true,
    secure: true,
  });

  // Send user’s basic info in the JSON response with HTTP status 200
  const resBody = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  res.status(200).json(resBody);
});

export default loginAccount;
