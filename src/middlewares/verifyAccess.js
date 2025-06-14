import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const verifyAccess = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new AppError("Access has expired", 401, "UnauthorizedError"));
  }

  try {
    const verifyToken = jwt.verify(accessToken, process.env.accessTokenKey);

    req.user = verifyToken.id;
    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token", 401, "UnauthorizedError", error)
    );
  }
};
export default verifyAccess;
