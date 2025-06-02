import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import AppError from "../../utils/AppError.js";
import jwt from "jsonwebtoken";
import ms from "ms";

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
        email: decoded.email,
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

  // Create access and refresh token
  const createAccessToken = jwt.sign(
    { email: userInDB.email },
    process.env.accessTokenKey,
    {
      expiresIn: ms("5m"),
    }
  );
  const createRefreshToken = jwt.sign(
    { email: userInDB.email },
    process.env.refreshTokenKey,
    {
      expiresIn: ms("15m"),
    }
  );

  // Save refresh token to user; throw error if save fails
  try {
    userInDB.token = createRefreshToken;
    userInDB.save();
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

  res.status(200).json({ message: "Access refreshed" });
});
export default refreshAccess;
