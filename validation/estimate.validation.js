import Joi from "joi";
import { id, nonNegativeMoney, nullableDate, nullableString, paginationSchema, percentage } from "./common.js";
import { lineItemSchema } from "./document.validation.js";

const fields = {
  estimateNumber: Joi.string().trim().max(80),
  customerId: id,
  vehicleId: id,
  status: Joi.string().valid("Draft", "Sent", "Approved", "Rejected"),
  vatPercentage: percentage,
  discount: nonNegativeMoney,
  defaultDiscount: nonNegativeMoney,
  notes: nullableString(5000),
  validUntil: nullableDate,
  estimateDate: Joi.date().iso(),
  documentType: nullableString(50),
  labourRate: nonNegativeMoney,
  jobNumber: nullableString(80),
  customerOrderNumber: nullableString(100),
  serviceAdvisor: nullableString(100),
  vehicleMileage: Joi.number().integer().min(0).allow("", null),
  creditTerms: nullableString(100),
  items: Joi.array().items(lineItemSchema).min(1),
};

export const createEstimateSchema = Joi.object({
  ...fields,
  estimateNumber: fields.estimateNumber.required(),
  customerId: fields.customerId.required(),
  vehicleId: fields.vehicleId.required(),
  estimateDate: fields.estimateDate.required(),
  status: fields.status.default("Draft"),
  vatPercentage: fields.vatPercentage.default(20),
  discount: fields.discount.default(0),
  defaultDiscount: fields.defaultDiscount.default(0),
  documentType: fields.documentType.default("Estimate"),
  labourRate: fields.labourRate.default(0),
  items: fields.items.required(),
});

export const updateEstimateSchema = Joi.object(fields).min(1);
export const estimateStatusSchema = Joi.object({ status: fields.status.required() });
export const estimateParamsSchema = Joi.object({ id: id.required() });
export const estimateListSchema = paginationSchema.keys({
  status: fields.status.optional(),
  customerId: id.optional(),
  vehicleId: id.optional(),
});
