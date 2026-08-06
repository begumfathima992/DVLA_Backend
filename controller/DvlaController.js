import axios from "axios";
import { env } from "../config/env.js";
import { Op } from "sequelize";
import { VehicleLookup } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchVehicle = asyncHandler(async (req, res) => {
  if (!env.dvlaApiKey) throw new AppError("DVLA API key is not configured", 503, "DVLA_NOT_CONFIGURED");
  const registrationNumber = req.body.registrationNumber.replace(/\s+/g, "").toUpperCase();

  try {
    const response = await axios.post(env.dvlaUrl, { registrationNumber }, {
      timeout: 12000,
      headers: {
        "x-api-key": env.dvlaApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    await VehicleLookup.create({
      registrationNumber,
      status: "Success",
      responseData: response.data,
      requestedIp: req.ip,
      userAgent: req.get("user-agent")?.slice(0, 500) || null,
    }).catch(() => null);

    res.json(response.data);
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const notFound = upstreamStatus === 404;
    await VehicleLookup.create({
      registrationNumber,
      status: notFound ? "Not Found" : "Failed",
      responseData: error.response?.data || null,
      errorMessage: error.response?.data?.message || error.message,
      requestedIp: req.ip,
      userAgent: req.get("user-agent")?.slice(0, 500) || null,
    }).catch(() => null);

    if (notFound) throw new AppError("Vehicle record not found", 404, "DVLA_NOT_FOUND");
    if (upstreamStatus === 400) throw new AppError(error.response?.data?.message || "DVLA rejected the registration number", 400, "DVLA_BAD_REQUEST");
    if (upstreamStatus === 401 || upstreamStatus === 403) throw new AppError("DVLA authentication failed; verify the API key", 502, "DVLA_AUTH_FAILED");
    throw new AppError("Vehicle lookup service is temporarily unavailable", 502, "DVLA_UNAVAILABLE");
  }
});

export const getVehicleLookupHistory = asyncHandler(async (req, res) => {
  const { search, status, page, limit } = req.query;
  const where = {};
  if (status) where.status = status;
  if (search) where.registrationNumber = { [Op.like]: `%${search.replace(/\s+/g, "").toUpperCase()}%` };
  const { rows, count } = await VehicleLookup.findAndCountAll({ where, order: [["createdAt", "DESC"]], limit, offset: (page - 1) * limit });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});
