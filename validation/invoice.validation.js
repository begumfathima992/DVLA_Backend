import Joi from "joi";
import { id, nonNegativeMoney, nullableDate, nullableString, paginationSchema, percentage } from "./common.js";
import { lineItemSchema } from "./document.validation.js";

const statuses = ["Draft", "Unpaid", "Partial", "Paid", "Overdue", "Void"];
const fields = {
  invoiceNumber: Joi.string().trim().max(80),
  customerId: id.allow(null),
  vehicleId: id.allow(null),
  estimateId: id.allow(null),
  jobSheetId: id.allow(null),
  customerName: Joi.string().trim().max(150),
  customer: Joi.string().trim().max(150),
  vehicleRegistration: Joi.string().trim().uppercase().max(20),
  vehicle: Joi.string().trim().uppercase().max(20),
  vehicleDescription: nullableString(255),
  make: nullableString(255),
  invoiceDate: Joi.date().iso(),
  date: Joi.date().iso(),
  dueDate: nullableDate,
  due: nullableDate,
  status: Joi.string().valid(...statuses),
  paidAmount: nonNegativeMoney,
  paid: nonNegativeMoney,
  paymentDate: nullableDate,
  paymentMethod: nullableString(50),
  vatPercentage: percentage,
  vatRate: percentage,
  discount: nonNegativeMoney,
  labourCharge: nonNegativeMoney,
  notes: nullableString(5000),
  items: Joi.array().items(lineItemSchema).min(1),
};

const withAliases = (schema) => schema
  .rename("customer", "customerName", { ignoreUndefined: true, override: false })
  .rename("vehicle", "vehicleRegistration", { ignoreUndefined: true, override: false })
  .rename("make", "vehicleDescription", { ignoreUndefined: true, override: false })
  .rename("date", "invoiceDate", { ignoreUndefined: true, override: false })
  .rename("due", "dueDate", { ignoreUndefined: true, override: false })
  .rename("paid", "paidAmount", { ignoreUndefined: true, override: false })
  .rename("vatRate", "vatPercentage", { ignoreUndefined: true, override: false });

export const createInvoiceSchema = withAliases(Joi.object({
  ...fields,
  invoiceNumber: fields.invoiceNumber.required(),
  customerName: fields.customerName.required(),
  vehicleRegistration: fields.vehicleRegistration.required(),
  invoiceDate: fields.invoiceDate.required(),
  status: fields.status.default("Draft"),
  paidAmount: fields.paidAmount.default(0),
  vatPercentage: fields.vatPercentage.default(20),
  discount: fields.discount.default(0),
  labourCharge: fields.labourCharge.default(0),
  items: fields.items.required(),
}));

export const updateInvoiceSchema = withAliases(Joi.object(fields).min(1));
export const invoiceStatusSchema = Joi.object({ status: fields.status.required() });
export const invoicePaymentSchema = Joi.object({
  amount: nonNegativeMoney.greater(0).required(),
  paymentDate: Joi.date().iso().default(() => new Date().toISOString().slice(0, 10)),
  paymentMethod: Joi.string().trim().max(50).default("Card"),
  reference: nullableString(100),
  notes: nullableString(1000),
});
export const invoiceParamsSchema = Joi.object({ id: Joi.alternatives().try(id, Joi.string().trim().max(80)).required() });
export const fromJobSheetParamsSchema = Joi.object({ jobSheetId: id.required() });
export const invoiceListSchema = paginationSchema.keys({
  status: fields.status.optional(),
  customerId: id.optional(),
  vehicleId: id.optional(),
});
