import AppError from "../../utils/AppError.js";
import userModel from "../../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// Sign Up
const registerAccount = expressAsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.validBody;

  // Check if all field (User info) are present if not send error response
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new AppError(
      "All field are required (first and last name, emails, password)",
      400,
      "ValidationError"
    );
  }

  // Check if the is a user with that email and if the is send back and error response
  const checkUserInDB = await userModel.findOne({ email });
  if (checkUserInDB) {
    throw new AppError(
      "This email is already associated with an account. Each email can only be used for one account.",
      400,
      "ValidationError"
    );
  }

  // Hash password
  const hashPassword = await bcrypt.hash(confirmPassword, 10);

  // Create user
  const newUser = await userModel.create({ firstName, lastName, email, password: hashPassword });

  // Send error response if unable to create user
  if (!newUser) {
    throw new AppError(
      "We encountered trying to create your account. Please try again latter",
      500,
      "ServerError"
    );
  }

  // Construct response body
  const resBody = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };

  // Send success response if user was created
  res.status(201).json(resBody);
});

export default registerAccount;
