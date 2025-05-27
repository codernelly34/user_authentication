import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import serverStatusRoute from "./routes/serverStatus.routes.js";
import localAuthRouter from "./routes/localAuth.routes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes
app.use(serverStatusRoute);
app.use("/account/local", localAuthRouter);

// Handle unknown Routes (404 not found)
app.all("*", (req, res) => {
  res.status(404).json({
    message: `Page/Route at (${req.method} ${req.path}) was not found`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
