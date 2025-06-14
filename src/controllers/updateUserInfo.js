import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const updateUserInfo = expressAsyncHandler(async (req, res) => {
  const email = req.user;
  const updateData = req.validBody;

  // Check if request body is empty
  if (Object.keys(updateData).length === 0) {
    throw new AppError(
      "No update data provided. Please include at least one field to update. (firstName, lastName)",
      400
    );
  }

  // Prevent users from updating their email
  if (updateData.email || updateData.password) {
    throw new AppError(
      "You cannot update your email or password from this endpoint. Please use the dedicated email/password update route. " +
        "Also, if your account was created using a third-party provider like Google and you wish to update your email, you must first add a password to your account. " +
        "After doing so, you will no longer be able to log in with Google but with your email and password.",
      403
    );
  }

  try {
    const updatedUser = await userModel
      .findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select("firstName lastName email provider -_id");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User info updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    throw new AppError("Internal server error", 500, "ServerError", error);
  }
});

export default updateUserInfo;
