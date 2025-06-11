import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";

const signOut = expressAsyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({ message: "Logout successfully" });
  }

  try {
    const userInDB = await userModel.findOne({ token: refreshToken });
    if (userInDB) {
      userInDB.token = "";
      await userInDB.save();
    }
  } catch (error) {
    throw new AppError(
      "And error occurred while trying to log-out of your account, Please try again",
      500,
      "ServerError",
      error
    );
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({ message: "Logout successfully" });
});

export default signOut;
