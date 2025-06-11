import { Router } from "express";
import verifyAccess from "../middlewares/verifyAccess.js";
import getUserInfo from "../controllers/getUserInfo.js";
import updateUserInfo from "../controllers/updateUserInfo.js";
import verifyRequestBody from "../middlewares/verifyRequestBody.js";

const privetRoutes = Router();

privetRoutes.use(verifyAccess);

privetRoutes.get("/get-user-info", getUserInfo);
privetRoutes.put("/update-user-info", verifyRequestBody, updateUserInfo);

export default privetRoutes;
