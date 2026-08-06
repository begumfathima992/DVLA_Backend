import Joi from "joi";
import { id, nullableDate, nullableString, paginationSchema } from "./common.js";

const registration = Joi.string().trim().uppercase().replace(/\s+/g, "").pattern(/^[A-Z0-9]{2,8}$/).messages({
  "string.pattern.base": "Enter a valid registration number without punctuation",
});

const fields = {
  customerId: id,
  registrationNumber: registration,
  make: Joi.string().trim().min(1).max(100),
  model: Joi.string().trim().min(1).max(150),
  year: Joi.number().integer().min(1886).max(new Date().getFullYear() + 1).allow("", null),
  vinNumber: nullableString(50),
  mileage: Joi.number().integer().min(0).allow("", null),
  engineNumber: nullableString(100),
  fuelType: nullableString(50),
  colour: nullableString(50),
  cc: Joi.number().integer().min(0).max(20000).allow("", null),
  grossWeight: Joi.number().precision(2).min(0).allow("", null),
  taxDueDate: nullableDate,
  motDueDate: nullableDate,
  nextServiceDate: nullableDate,
  lastMileage: Joi.number().integer().min(0).allow("", null),
};

export const createVehicleSchema = Joi.object({
  ...fields,
  customerId: fields.customerId.required(),
  registrationNumber: fields.registrationNumber.required(),
  make: fields.make.required(),
  model: fields.model.required(),
});

export const updateVehicleSchema = Joi.object(fields).min(1);
export const vehicleParamsSchema = Joi.object({ id: id.required() });
export const customerVehicleParamsSchema = Joi.object({ customerId: id.required() });
export const vehicleListSchema = paginationSchema.keys({ customerId: id.optional() });
