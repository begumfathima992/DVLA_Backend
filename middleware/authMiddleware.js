import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }

  const user = await User.unscoped().findByPk(decoded.id);
  if (!user || !user.token || user.token !== token || !user.isActive) {
    throw new AppError("Session is no longer active", 401, "SESSION_EXPIRED");
  }

  req.user = user;
  req.auth = decoded;
  next();
});

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403, "FORBIDDEN"));
  }
  return next();
};
