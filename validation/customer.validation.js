import Joi from "joi";
import { id, nullableString, paginationSchema } from "./common.js";

const ukPhone = Joi.string().trim().replace(/[\s()-]/g, "").pattern(/^(?:\+44|0)\d{9,10}$/).messages({
  "string.pattern.base": "Enter a valid UK phone number, for example 07700900123 or +447700900123",
});

const fields = {
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email().max(191),
  phone: ukPhone,
  address: Joi.string().trim().max(1000),
  customerCode: nullableString(50),
  telephone: nullableString(30),
  gdprConsent: Joi.boolean(),
  creditTerms: nullableString(100),
  alternativeAddress: nullableString(1000),
};

export const createCustomerSchema = Joi.object({
  ...fields,
  name: fields.name.required(),
  email: fields.email.required(),
  phone: fields.phone.required(),
  address: fields.address.required(),
  gdprConsent: fields.gdprConsent.default(false),
});

export const updateCustomerSchema = Joi.object(fields).min(1);
export const customerParamsSchema = Joi.object({ id: id.required() });
export const customerListSchema = paginationSchema;
