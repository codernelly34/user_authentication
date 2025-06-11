import { Router } from "express";
import signOut from "../controllers/logoutUser.js";
import refreshAccess from "../controllers/refreshAccess.js";

const accountRoute = Router();

accountRoute.get("/logout", signOut);
accountRoute.get("/refresh-access", refreshAccess);

export default accountRoute;
