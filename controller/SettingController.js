import { Setting } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const defaults = { defaultDiscount: 0, labourCharge: 0, otherCharge: 0, vatPercentage: 20 };

export const getSettings = asyncHandler(async (_req, res) => {
  const [setting] = await Setting.findOrCreate({ where: { id: 1 }, defaults: { id: 1, ...defaults } });
  res.json({ success: true, message: "Settings fetched successfully", data: setting });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const [setting] = await Setting.findOrCreate({ where: { id: 1 }, defaults: { id: 1, ...defaults } });
  await setting.update(req.body);
  res.json({ success: true, message: "Settings updated successfully", data: setting });
});
