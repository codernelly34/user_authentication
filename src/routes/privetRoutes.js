import { Router } from "express";
import verifyAccess from "../middlewares/verifyAccess.js";
import getUserInfo from "../controllers/localAuth/getUserInfo.js";

const privetRoutes = Router();

privetRoutes.use(verifyAccess);

privetRoutes.get("/get-user-info", getUserInfo);

export default privetRoutes;
