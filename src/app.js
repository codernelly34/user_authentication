import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(errorHandler);

export { app };
