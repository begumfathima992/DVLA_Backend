import Joi from "joi";
import { id, paginationSchema } from "./common.js";

const password = Joi.string().min(8).max(128).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).messages({
  "string.pattern.base": "Password must include uppercase, lowercase and a number",
});

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().max(191).required(),
  password: password.required(),
  role: Joi.string().valid("Admin", "Manager", "Technician").required(),
  isActive: Joi.boolean().default(true),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email().max(191),
  role: Joi.string().valid("Admin", "Manager", "Technician"),
  isActive: Joi.boolean(),
}).min(1);

export const updatePasswordSchema = Joi.object({ password: password.required() });
export const userParamsSchema = Joi.object({ id: id.required() });
export const userListSchema = paginationSchema.keys({
  role: Joi.string().valid("Admin", "Manager", "Technician").optional(),
  isActive: Joi.boolean().optional(),
});
