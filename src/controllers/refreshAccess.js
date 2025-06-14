import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import ms from "ms";
import issueAuthToken from "../utils/issueAuthToken.js";

const refreshAccess = expressAsyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(
      "Session expired. Please log in again.",
      403,
      "UnauthorizedError"
    );
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.refreshTokenKey);
  } catch (error) {
    throw new AppError(
      "Session expired. Please log in again.",
      403,
      "UnauthorizedError",
      error
    );
  }

  const userInDB = await userModel.findOne({ token: refreshToken });

  // Token reuse detected
  if (!userInDB) {
    try {
      const hackedUser = await userModel.findOne({
        id: decoded.id,
      });
      if (hackedUser) {
        hackedUser.token = "";
        await hackedUser.save();
      }
      return res
        .status(403)
        .json({ message: "Session expired. Please log in again." });
    } catch (error) {
      throw new AppError(
        "Session expired. Please log in again.",
        500,
        "ServerError",
        error
      );
    }
  }

  await issueAuthToken(userInDB, res);

  res.status(200).json({ message: "Access refreshed" });
});
export default refreshAccess;
