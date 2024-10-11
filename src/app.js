import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import serverStatusRoute from "./routes/serverStatus.routes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes
app.use(serverStatusRoute);

// Error Handler Middleware
app.use(errorHandler);

export { app };
