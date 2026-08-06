import { Op } from "sequelize";
import { Customer, Estimate, JobSheet, JobSheetItem, Vehicle, sequelize } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateDocumentTotals } from "../utils/documentTotals.js";

const includeJobSheet = [
  { model: Customer, as: "customer" },
  { model: Vehicle, as: "vehicle" },
  { model: Estimate, as: "estimate" },
  { model: JobSheetItem, as: "items" },
];

const buildData = (body, totals, existing = {}) => ({
  jobNumber: body.jobNumber ?? existing.jobNumber,
  estimateId: body.estimateId ?? existing.estimateId,
  customerId: body.customerId ?? existing.customerId,
  vehicleId: body.vehicleId ?? existing.vehicleId,
  technicianName: body.technicianName ?? existing.technicianName ?? null,
  vehicleMileage: body.vehicleMileage === "" ? null : (body.vehicleMileage ?? existing.vehicleMileage ?? null),
  serviceAdvisor: body.serviceAdvisor ?? existing.serviceAdvisor ?? null,
  priority: body.priority ?? existing.priority ?? "Medium",
  status: body.status ?? existing.status ?? "Open",
  startDate: body.startDate === "" ? null : (body.startDate ?? existing.startDate ?? null),
  completedDate: body.completedDate === "" ? null : (body.completedDate ?? existing.completedDate ?? null),
  labourRate: totals.labourCharge,
  notes: body.notes ?? existing.notes ?? null,
  subtotal: totals.subtotal,
  vatPercentage: Number(body.vatPercentage ?? existing.vatPercentage ?? 20),
  vatAmount: totals.vatAmount,
  discount: totals.discount,
  total: totals.total,
});

export const createJobSheet = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const estimate = await Estimate.findByPk(req.body.estimateId, { transaction });
    if (!estimate) throw new AppError("Estimate not found", 404);
    if (Number(estimate.customerId) !== Number(req.body.customerId) || Number(estimate.vehicleId) !== Number(req.body.vehicleId)) {
      throw new AppError("Job sheet customer and vehicle must match the estimate", 422, "RELATIONSHIP_ERROR");
    }
    if (await JobSheet.findOne({ where: { estimateId: estimate.id }, transaction })) throw new AppError("A job sheet already exists for this estimate", 409, "CONFLICT");
    const totals = calculateDocumentTotals({ items: req.body.items, vatPercentage: req.body.vatPercentage, discount: req.body.discount, labourCharge: req.body.labourRate });
    const jobSheet = await JobSheet.create(buildData(req.body, totals), { transaction });
    await JobSheetItem.bulkCreate(totals.items.map((item) => ({ ...item, jobSheetId: jobSheet.id })), { transaction });
    await transaction.commit();
    const result = await JobSheet.findByPk(jobSheet.id, { include: includeJobSheet });
    res.status(201).json({ success: true, message: "Job sheet created successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const getJobSheets = asyncHandler(async (req, res) => {
  const { search, status, priority, customerId, vehicleId, page, limit } = req.query;
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (customerId) where.customerId = customerId;
  if (vehicleId) where.vehicleId = vehicleId;
  if (search) where[Op.or] = ["jobNumber", "technicianName", "serviceAdvisor"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));

  const { rows, count } = await JobSheet.findAndCountAll({ where, include: includeJobSheet, order: [["createdAt", "DESC"]], limit, offset: (page - 1) * limit, distinct: true });
  const data = rows.map((row) => {
    const json = row.toJSON();
    return { ...json, totalPrice: Number(json.total || 0) };
  });
  res.json({ success: true, count, data, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getJobSheetById = asyncHandler(async (req, res) => {
  const jobSheet = await JobSheet.findByPk(req.params.id, { include: includeJobSheet });
  if (!jobSheet) throw new AppError("Job sheet not found", 404);
  res.json({ success: true, data: jobSheet });
});

export const updateJobSheet = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const jobSheet = await JobSheet.findByPk(req.params.id, { include: [{ model: JobSheetItem, as: "items" }], transaction, lock: transaction.LOCK.UPDATE });
    if (!jobSheet) throw new AppError("Job sheet not found", 404);
    if ((req.body.estimateId && Number(req.body.estimateId) !== Number(jobSheet.estimateId)) ||
        (req.body.customerId && Number(req.body.customerId) !== Number(jobSheet.customerId)) ||
        (req.body.vehicleId && Number(req.body.vehicleId) !== Number(jobSheet.vehicleId))) {
      throw new AppError("Estimate, customer and vehicle links cannot be changed on a job sheet", 409, "RELATIONSHIP_LOCKED");
    }
    const items = req.body.items ?? jobSheet.items.map((item) => item.toJSON());
    const totals = calculateDocumentTotals({
      items,
      vatPercentage: req.body.vatPercentage ?? jobSheet.vatPercentage,
      discount: req.body.discount ?? jobSheet.discount,
      labourCharge: req.body.labourRate ?? jobSheet.labourRate,
    });
    const payload = buildData(req.body, totals, jobSheet.toJSON());
    if (payload.status === "Completed" && !payload.completedDate) payload.completedDate = new Date().toISOString().slice(0, 10);
    if (payload.status !== "Completed" && req.body.status) payload.completedDate = null;
    await jobSheet.update(payload, { transaction });
    if (req.body.items) {
      await JobSheetItem.destroy({ where: { jobSheetId: jobSheet.id }, transaction });
      await JobSheetItem.bulkCreate(totals.items.map((item) => ({ ...item, jobSheetId: jobSheet.id })), { transaction });
    }
    await transaction.commit();
    const result = await JobSheet.findByPk(jobSheet.id, { include: includeJobSheet });
    res.json({ success: true, message: "Job sheet updated successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const updateJobSheetPriority = asyncHandler(async (req, res) => {
  const jobSheet = await JobSheet.findByPk(req.params.id);
  if (!jobSheet) throw new AppError("Job sheet not found", 404);
  await jobSheet.update({ priority: req.body.priority });
  res.json({ success: true, message: "Priority updated successfully", data: jobSheet });
});

export const updateJobSheetStatus = asyncHandler(async (req, res) => {
  const jobSheet = await JobSheet.findByPk(req.params.id);
  if (!jobSheet) throw new AppError("Job sheet not found", 404);
  const completedDate = req.body.status === "Completed" ? (jobSheet.completedDate || new Date().toISOString().slice(0, 10)) : null;
  await jobSheet.update({ status: req.body.status, completedDate });
  res.json({ success: true, message: "Status updated successfully", data: jobSheet });
});
