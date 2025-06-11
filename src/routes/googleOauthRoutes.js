import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import ms from "ms";
import AppError from "../utils/AppError.js";

const googleOauthRoutes = Router();

// Middlewares
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const capitalize = (text = "") =>
          text.charAt(0).toUpperCase() + text.slice(1);
        const checkUserInDB = await userModel.findOne({
          email,
        });

        if (checkUserInDB) {
          // If user exists but provider is not google, reject login
          if (checkUserInDB.provider !== "google") {
            return done(
              {
                message: `This email is already registered with ${
                  checkUserInDB.provider === "local"
                    ? "a password"
                    : capitalize(checkUserInDB.provider)
                }. Please log in using your ${
                  checkUserInDB.provider === "local"
                    ? "email and password"
                    : `${capitalize(checkUserInDB.provider)} account`
                }.`,
              },
              null
            );
          }

          // User exists and provider is google → allow login
          return done(null, { cUser: checkUserInDB });
        }

        // If user not found → create new Google account
        const newUser = await userModel.create({
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          email: email,
          provider: "google",
        });

        return done(null, { cUser: newUser, isNew: true });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Routes

// 👇 Trigger Google OAuth consent screen
googleOauthRoutes.get(
  "/register",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 👇 Google callback
googleOauthRoutes.get("/redirect", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) {
      return res.status(500).json({ err });
    }

    const { cUser, isNew } = user;

    // Create access and refresh token
    const createAccessToken = jwt.sign(
      { email: cUser.email },
      process.env.accessTokenKey,
      {
        expiresIn: ms("5m"),
      }
    );
    const createRefreshToken = jwt.sign(
      { email: cUser.email },
      process.env.refreshTokenKey,
      {
        expiresIn: ms("15m"),
      }
    );

    // Save refresh token to user; throw error if save fails
    try {
      cUser.token = createRefreshToken;
      await cUser.save();
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

    if (isNew) {
      return res.status(201).json({
        message:
          "Welcome! Your account has been created and you’re now logged in.",
        cUser,
      });
    }

    // Successful authentication
    res
      .status(200)
      .json({ message: "Welcome back! You’re now logged in.", cUser });
  })(req, res, next);
});

export default googleOauthRoutes;
