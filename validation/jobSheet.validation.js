import Joi from "joi";
import { id, nonNegativeMoney, nullableDate, nullableString, paginationSchema, percentage } from "./common.js";
import { lineItemSchema } from "./document.validation.js";

export const jobStatuses = ["Open", "In Progress", "Completed", "Cancelled"];
export const jobPriorities = ["Low", "Medium", "High", "Urgent"];

const fields = {
  jobNumber: Joi.string().trim().max(80),
  estimateId: id,
  customerId: id,
  vehicleId: id,
  technicianName: nullableString(100),
  vehicleMileage: Joi.number().integer().min(0).allow("", null),
  serviceAdvisor: nullableString(100),
  priority: Joi.string().valid(...jobPriorities),
  status: Joi.string().valid(...jobStatuses),
  startDate: nullableDate,
  completedDate: nullableDate,
  labourRate: nonNegativeMoney,
  notes: nullableString(5000),
  vatPercentage: percentage,
  discount: nonNegativeMoney,
  items: Joi.array().items(lineItemSchema).min(1),
};

export const createJobSheetSchema = Joi.object({
  ...fields,
  jobNumber: fields.jobNumber.required(),
  estimateId: fields.estimateId.required(),
  customerId: fields.customerId.required(),
  vehicleId: fields.vehicleId.required(),
  priority: fields.priority.default("Medium"),
  status: fields.status.default("Open"),
  labourRate: fields.labourRate.default(0),
  vatPercentage: fields.vatPercentage.default(20),
  discount: fields.discount.default(0),
  items: fields.items.required(),
});

export const updateJobSheetSchema = Joi.object(fields).min(1);
export const jobStatusSchema = Joi.object({ status: fields.status.required() });
export const jobPrioritySchema = Joi.object({ priority: fields.priority.required() });
export const jobSheetParamsSchema = Joi.object({ id: id.required() });
export const jobSheetListSchema = paginationSchema.keys({
  status: fields.status.optional(),
  priority: fields.priority.optional(),
  customerId: id.optional(),
  vehicleId: id.optional(),
});
