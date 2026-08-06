import { Op } from "sequelize";
import { Customer, Vehicle } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const includeCustomer = [{ model: Customer, as: "customer" }];
const normalise = (payload) => {
  const cleaned = { ...payload };
  if (Object.prototype.hasOwnProperty.call(cleaned, "registrationNumber")) {
    cleaned.registrationNumber = cleaned.registrationNumber.replace(/\s+/g, "").toUpperCase();
  }
  for (const key of ["vinNumber", "engineNumber", "fuelType", "colour", "taxDueDate", "motDueDate", "nextServiceDate"]) {
    if (Object.prototype.hasOwnProperty.call(cleaned, key)) cleaned[key] = cleaned[key] || null;
  }
  return cleaned;
};

const ensureCustomer = async (customerId) => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) throw new AppError("Customer not found", 404);
  return customer;
};

export const createVehicle = asyncHandler(async (req, res) => {
  await ensureCustomer(req.body.customerId);
  const vehicle = await Vehicle.create(normalise(req.body));
  const result = await Vehicle.findByPk(vehicle.id, { include: includeCustomer });
  res.status(201).json({ success: true, message: "Vehicle created successfully", data: result });
});

export const getVehicles = asyncHandler(async (req, res) => {
  const { search, customerId, page, limit } = req.query;
  const where = {};
  if (customerId) where.customerId = customerId;
  if (search) {
    where[Op.or] = ["registrationNumber", "make", "model", "vinNumber", "colour"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));
  }

  const { rows, count } = await Vehicle.findAndCountAll({
    where,
    include: includeCustomer,
    order: [["createdAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getVehiclesByCustomer = asyncHandler(async (req, res) => {
  await ensureCustomer(req.params.customerId);
  const vehicles = await Vehicle.findAll({ where: { customerId: req.params.customerId }, include: includeCustomer, order: [["createdAt", "DESC"]] });
  res.json({ success: true, data: vehicles });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  // Compatibility with the current UI: GET /vehicle/:customerId?id=:customerId
  if (req.query.id && String(req.query.id) === String(req.params.id)) {
    const vehicles = await Vehicle.findAll({ where: { customerId: req.params.id }, include: includeCustomer, order: [["createdAt", "DESC"]] });
    return res.json({ success: true, data: vehicles });
  }

  const vehicle = await Vehicle.findByPk(req.params.id, { include: includeCustomer });
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return res.json({ success: true, data: vehicle });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  if (req.body.customerId) await ensureCustomer(req.body.customerId);
  await vehicle.update(normalise(req.body));
  const result = await Vehicle.findByPk(vehicle.id, { include: includeCustomer });
  res.json({ success: true, message: "Vehicle updated successfully", data: result });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  await vehicle.destroy();
  res.json({ success: true, message: "Vehicle deleted successfully" });
});
