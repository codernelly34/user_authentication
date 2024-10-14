import asyncHandler from "express-async-handler";
import { userModel } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import { PasswordSaltRounds } from "../utils/constants.js";

const registerAccount = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  // Check for missing fields
  if (!name || !username || !email || !password) {
    return res.status(400).json({
      message: "Name, Username, Email, and Password are required to create an account",
    });
  }

  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new AppError({
      message:
        "There is a user with that username or email. Please provide a unique username and email.",
      statusCode: 406,
      type: "OperationalError",
      error: "existing user in DB",
    });
  }

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, PasswordSaltRounds);
  } catch (error) {
    throw new AppError({
      message: "An error occurred while creating the account. Please try again.",
      statusCode: 500,
      type: "ServerError",
      error,
    });
  }

  // Create new user
  const newUser = {
    name,
    username,
    email,
    password: hashedPassword,
  };

  const createdUser = await userModel.create(newUser);

  if (!createdUser) {
    throw new AppError({
      message: "An error occurred while creating the account. Please try again.",
      statusCode: 500,
      type: "ServerError",
      error: "error while creating user in DB",
    });
  }

  // Success response
  res.status(201).json({
    message: "User created successfully",
    data: { id: createdUser.id, name, email },
  });
});

export { registerAccount };
