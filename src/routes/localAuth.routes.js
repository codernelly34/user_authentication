import { Router } from "express";
import verifyRequestBody from "../middlewares/verifyRequestBody.js";
import registerAccount from "../controllers/localAuth/registerUser.js";
import loginAccount from "../controllers/localAuth/loginUser.js";
import signOut from "../controllers/localAuth/logoutUser.js";
import refreshAccess from "../controllers/localAuth/refreshAccess.js";

const localAuthRouter = Router();

localAuthRouter.use(verifyRequestBody);

localAuthRouter.route("/register").post(registerAccount);
localAuthRouter.route("/login").post(loginAccount);
localAuthRouter.get("/logout", signOut);
localAuthRouter.get("/refresh-access", refreshAccess);

export default localAuthRouter;
