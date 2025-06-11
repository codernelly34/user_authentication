import { Router } from "express";
import verifyRequestBody from "../middlewares/verifyRequestBody.js";
import registerAccount from "../controllers/localAuth/registerUser.js";
import loginAccount from "../controllers/localAuth/loginUser.js";

const localAuthRouter = Router();

localAuthRouter.use(verifyRequestBody);

localAuthRouter.route("/register").post(registerAccount);
localAuthRouter.route("/login").post(loginAccount);

export default localAuthRouter;
