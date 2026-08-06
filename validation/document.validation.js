import Joi from "joi";
import { nonNegativeMoney, percentage } from "./common.js";

export const lineItemSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  itemType: Joi.string().valid("Part", "Parts", "Labour", "Service", "Other").default("Part"),
  type: Joi.string().valid("Part", "Parts", "Labour", "Service", "Other").optional(),
  description: Joi.string().trim().min(1).max(500).required(),
  desc: Joi.string().trim().min(1).max(500).optional(),
  quantity: Joi.number().precision(2).greater(0).required(),
  qty: Joi.number().precision(2).greater(0).optional(),
  unitPrice: nonNegativeMoney.required(),
  rate: nonNegativeMoney.optional(),
  vat: percentage.optional(),
  totalPrice: nonNegativeMoney.optional(),
}).rename("desc", "description", { ignoreUndefined: true, override: false })
  .rename("qty", "quantity", { ignoreUndefined: true, override: false })
  .rename("rate", "unitPrice", { ignoreUndefined: true, override: false })
  .rename("type", "itemType", { ignoreUndefined: true, override: false });
