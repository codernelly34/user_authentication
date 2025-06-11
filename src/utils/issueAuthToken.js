import jwt from "jsonwebtoken";
import ms from "ms";
import AppError from "../utils/AppError.js";

async function issueAuthToken(user, res) {
  // Create access and refresh token
  const createAccessToken = jwt.sign(
    { email: user.email },
    process.env.accessTokenKey,
    {
      expiresIn: ms("5m"),
    }
  );
  const createRefreshToken = jwt.sign(
    { email: user.email },
    process.env.refreshTokenKey,
    {
      expiresIn: ms("15m"),
    }
  );

  // Save refresh token to user; throw error if save fails
  try {
    user.token = createRefreshToken;
    await user.save();
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
    sameSite: "none",
  });
  res.cookie("refreshToken", createRefreshToken, {
    maxAge: ms("15m"),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}

export default issueAuthToken;
