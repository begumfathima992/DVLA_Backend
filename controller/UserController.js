import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { search, role, isActive, page, limit } = req.query;
  const where = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) where[Op.or] = ["name", "email"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));
  const { rows, count } = await User.findAndCountAll({ where, order: [["createdAt", "DESC"]], limit, offset: (page - 1) * limit });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const createUser = asyncHandler(async (req, res) => {
  const existing = await User.unscoped().findOne({ where: { email: req.body.email } });
  if (existing) throw new AppError("Email already registered", 409, "CONFLICT");
  const password = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, password });
  res.status(201).json({ success: true, message: "User created successfully", data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  const isSelf = Number(user.id) === Number(req.user.id);
  if (isSelf && req.body.isActive === false) throw new AppError("You cannot deactivate your own account", 409, "SELF_DEACTIVATION");
  if (isSelf && req.body.role && req.body.role !== "Admin") throw new AppError("You cannot remove your own admin role", 409, "SELF_ROLE_CHANGE");
  const removesAdmin = user.role === "Admin" && (req.body.role && req.body.role !== "Admin" || req.body.isActive === false);
  if (removesAdmin && await User.count({ where: { role: "Admin", isActive: true } }) <= 1) {
    throw new AppError("At least one active admin account is required", 409, "LAST_ADMIN");
  }
  await user.update(req.body);
  res.json({ success: true, message: "User updated successfully", data: user });
});

export const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.unscoped().findByPk(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  const password = await bcrypt.hash(req.body.password, 12);
  await user.update({ password, token: null });
  res.json({ success: true, message: "Password updated; existing session has been revoked" });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  if (Number(user.id) === Number(req.user.id)) throw new AppError("You cannot delete your own account", 409, "SELF_DELETE");
  if (user.role === "Admin" && user.isActive && await User.count({ where: { role: "Admin", isActive: true } }) <= 1) {
    throw new AppError("At least one active admin account is required", 409, "LAST_ADMIN");
  }
  await user.destroy();
  res.json({ success: true, message: "User deleted successfully" });
});
