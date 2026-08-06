import Joi from "joi";
import { paginationSchema } from "./common.js";

export const dvlaSearchSchema = Joi.object({
  registrationNumber: Joi.string().trim().uppercase().replace(/\s+/g, "").pattern(/^[A-Z0-9]{2,8}$/).required().messages({
    "string.pattern.base": "Enter a valid UK registration number",
  }),
});

export const dvlaHistorySchema = paginationSchema.keys({ status: Joi.string().valid("Success", "Not Found", "Failed").optional() });
