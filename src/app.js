import express from "express";
import privetRoutes from "./routes/privetRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import localAuthRouter from "./routes/localAuth.routes.js";
import serverStatusRoute from "./routes/serverStatus.routes.js";
import cookieParser from "cookie-parser";
import googleOauthRoutes from "./routes/googleOauthRoutes.js";
import accountRoute from "./routes/accountRoutes.js";
// import facebookOauthRoute from "./routes/facebookOauthRoutes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use(serverStatusRoute);
app.use("/account", accountRoute);
app.use("/account/local", localAuthRouter);
app.use("/account/google", googleOauthRoutes);
// app.use("/account/facebook-auth", facebookOauthRoute);
app.use("/privet", privetRoutes);

// Handle unknown Routes (404 not found)
app.all("*", (req, res) => {
  res.status(404).json({
    message: `Page/Route at (${req.method} ${req.path}) was not found`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
