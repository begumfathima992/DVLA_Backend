import Joi from "joi";

export const id = Joi.number().integer().positive();
export const nullableString = (max = 255) => Joi.string().trim().max(max).allow("", null);
export const nullableDate = Joi.date().iso().allow("", null);
export const nonNegativeMoney = Joi.number().precision(2).min(0);
export const percentage = Joi.number().precision(2).min(0).max(100);

export const idParamSchema = Joi.object({ id: id.required() });
export const paginationSchema = Joi.object({
  search: Joi.string().trim().max(100).allow("").default(""),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
});
