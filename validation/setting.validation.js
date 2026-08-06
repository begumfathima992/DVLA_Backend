import Joi from "joi";
import { nonNegativeMoney, percentage } from "./common.js";

export const settingSchema = Joi.object({
  defaultDiscount: nonNegativeMoney.required(),
  labourCharge: nonNegativeMoney.required(),
  otherCharge: nonNegativeMoney.required(),
  vatPercentage: percentage.required(),
});
