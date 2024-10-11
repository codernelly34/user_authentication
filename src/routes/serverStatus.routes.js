import { Router } from "express";
import { serverStatus, serverInfo } from "../controllers/serverStatus.controller.js";

const serverStatusRoute = Router();

serverStatusRoute.route("/").get(serverInfo);
serverStatusRoute.route("/info").get(serverInfo);
serverStatusRoute.route("/status").get(serverStatus);

export default serverStatusRoute;
