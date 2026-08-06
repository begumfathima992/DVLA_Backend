import { Op } from "sequelize";
import { ContactEnquiry } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createContactEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await ContactEnquiry.create({
    ...req.body,
    registration: req.body.registration?.replace(/\s+/g, "").toUpperCase() || null,
    service: req.body.service || null,
  });
  res.status(201).json({ success: true, message: "Your enquiry has been received", data: { id: enquiry.id, status: enquiry.status, createdAt: enquiry.createdAt } });
});

export const getContactEnquiries = asyncHandler(async (req, res) => {
  const { search, status, page, limit } = req.query;
  const where = {};
  if (status) where.status = status;
  if (search) where[Op.or] = ["firstName", "lastName", "email", "phone", "registration", "service"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));
  const { rows, count } = await ContactEnquiry.findAndCountAll({ where, order: [["createdAt", "DESC"]], limit, offset: (page - 1) * limit });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getContactEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await ContactEnquiry.findByPk(req.params.id);
  if (!enquiry) throw new AppError("Contact enquiry not found", 404);
  res.json({ success: true, data: enquiry });
});

export const updateContactEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await ContactEnquiry.findByPk(req.params.id);
  if (!enquiry) throw new AppError("Contact enquiry not found", 404);
  await enquiry.update(req.body);
  res.json({ success: true, message: "Contact enquiry updated successfully", data: enquiry });
});

export const deleteContactEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await ContactEnquiry.findByPk(req.params.id);
  if (!enquiry) throw new AppError("Contact enquiry not found", 404);
  await enquiry.destroy();
  res.json({ success: true, message: "Contact enquiry deleted successfully" });
});
