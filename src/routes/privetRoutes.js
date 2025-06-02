import { Router } from "express";
import verifyAccess from "../middlewares/verifyAccess.js";
import getUserInfo from "../controllers/localAuth/getUserInfo.js";
import updateUserInfo from "../controllers/localAuth/updateUserInfo.js";

const privetRoutes = Router();

privetRoutes.use(verifyAccess);

privetRoutes.get("/get-user-info", getUserInfo);
privetRoutes.put("/update-user-info", updateUserInfo);

export default privetRoutes;
