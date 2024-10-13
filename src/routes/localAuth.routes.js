import { Router } from "express";
import verifyRequestBody from "../middlewares/verifyRequestBody.js";
import { registerAccount } from "../controllers/localAuth.controller.js";

const localAuthRouter = Router();

localAuthRouter.use(verifyRequestBody);

localAuthRouter.route("/register").post(registerAccount);

export default localAuthRouter;
