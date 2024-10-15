import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import serverStatusRoute from "./routes/serverStatus.routes.js";
import localAuthRouter from "./routes/localAuth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes
app.use(serverStatusRoute);
app.use("/account", localAuthRouter);

// Error Handler Middleware
app.use(errorHandler);

export { app };
