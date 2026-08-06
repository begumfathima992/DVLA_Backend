import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const userCount = await User.count();
  if (userCount > 0 && !env.allowPublicRegistration) {
    throw new AppError("Public registration is disabled", 403, "REGISTRATION_DISABLED");
  }

  const existing = await User.unscoped().findOne({ where: { email: req.body.email } });
  if (existing) throw new AppError("Email already registered", 409, "CONFLICT");

  const password = await bcrypt.hash(req.body.password, 12);
  const role = userCount === 0 ? "Admin" : "Technician";
  const user = await User.create({ ...req.body, role, password });

  res.status(201).json({ success: true, message: "User registered successfully", data: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.unscoped().findOne({ where: { email: req.body.email } });
  if (!user || !user.isActive) throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  await user.update({ token, lastLoginAt: new Date() });

  res.json({ success: true, message: "Login successful", token, user: publicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  await req.user.update({ token: null });
  res.json({ success: true, message: "Logout successful" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: publicUser(req.user) });
});
