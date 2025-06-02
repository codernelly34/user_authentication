import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import AppError from "../../utils/AppError.js";

const updateUserInfo = expressAsyncHandler(async (req, res) => {
  const email = req.user;
  const updateData = req.validBody;

  // Check if request body is empty
  if (Object.keys(updateData).length === 0) {
    throw new AppError(
      "No update data provided. Please include at least one field to update.",
      400
    );
  }

  try {
    const updatedUser = await userModel.findOneAndUpdate(
      email,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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
