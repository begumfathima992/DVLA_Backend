import Joi from "joi";
import { id, nullableString, paginationSchema } from "./common.js";

const statuses = ["New", "In Review", "Contacted", "Booked", "Closed", "Spam"];
export const createContactSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().min(1).max(80).required(),
  email: Joi.string().trim().lowercase().email().max(191).required(),
  phone: Joi.string().trim().min(7).max(30).required(),
  registration: nullableString(20),
  service: nullableString(100),
  message: Joi.string().trim().min(5).max(5000).required(),
  consent: Joi.boolean().valid(true).default(true),
  source: Joi.string().trim().max(50).default("website"),
});

export const updateContactSchema = Joi.object({
  status: Joi.string().valid(...statuses),
  assignedTo: nullableString(100),
  internalNotes: nullableString(5000),
}).min(1);

export const contactParamsSchema = Joi.object({ id: id.required() });
export const contactListSchema = paginationSchema.keys({ status: Joi.string().valid(...statuses).optional() });
