import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().max(191).required(),
  password: Joi.string().min(8).max(128).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/).required().messages({
    "string.pattern.base": "Password must include uppercase, lowercase and a number",
  }),
  role: Joi.string().valid("Admin", "Manager", "Technician").default("Admin"),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).max(128).required(),
});
