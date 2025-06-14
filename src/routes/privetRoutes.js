import { Router } from "express";
import verifyAccess from "../middlewares/verifyAccess.js";
import getUserInfo from "../controllers/getUserInfo.js";
import updateUserInfo from "../controllers/updateUserInfo.js";
import verifyRequestBody from "../middlewares/verifyRequestBody.js";
import updateEmail from "../controllers/updateEmail.js";
import updatePassword from "../controllers/updatePassword.js";

const privetRoutes = Router();

privetRoutes.use(verifyAccess);

privetRoutes.get("/get-user-info", getUserInfo);

privetRoutes.use(verifyRequestBody);

privetRoutes.put("/update-user-info", updateUserInfo);
privetRoutes.patch("/update-user-email", updateEmail);
privetRoutes.patch("/update-user-password", updatePassword);

export default privetRoutes;
