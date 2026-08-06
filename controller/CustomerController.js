import { Op } from "sequelize";
import { Customer } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cleanPayload = (payload) => {
  const cleaned = { ...payload };
  for (const key of ["customerCode", "telephone", "creditTerms", "alternativeAddress"]) {
    if (Object.prototype.hasOwnProperty.call(cleaned, key)) cleaned[key] = cleaned[key] || null;
  }
  return cleaned;
};

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(cleanPayload(req.body));
  res.status(201).json({ success: true, message: "Customer created successfully", data: customer });
});

export const getCustomers = asyncHandler(async (req, res) => {
   console.log("errorrr");
  const { search, page, limit } = req.query;
 
  
  const where = search ? {
    [Op.or]: ["name", "email", "phone", "customerCode", "telephone", "address"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } })),
  } : {};

  const { rows, count } = await Customer.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
  });

  res.json({ success: true, message: "Customers fetched successfully", data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) throw new AppError("Customer not found", 404);
  res.json({ success: true, data: customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) throw new AppError("Customer not found", 404);
  await customer.update(cleanPayload(req.body));
  res.json({ success: true, message: "Customer updated successfully", data: customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) throw new AppError("Customer not found", 404);
  await customer.destroy();
  res.json({ success: true, message: "Customer deleted successfully" });
});
