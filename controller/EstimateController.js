import { Op } from "sequelize";
import { Customer, Estimate, EstimateItem, JobSheet, JobSheetItem, Vehicle, sequelize } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateDocumentTotals } from "../utils/documentTotals.js";
import { createDocumentNumber } from "../utils/documentNumber.js";

const includeEstimate = [
  { model: Customer, as: "customer" },
  { model: Vehicle, as: "vehicle" },
  { model: EstimateItem, as: "items" },
  { model: JobSheet, as: "jobSheet", required: false },
];

const ensureRelations = async (customerId, vehicleId, transaction) => {
  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) throw new AppError("Customer not found", 404);
  const vehicle = await Vehicle.findByPk(vehicleId, { transaction });
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  if (Number(vehicle.customerId) !== Number(customerId)) throw new AppError("Selected vehicle does not belong to the selected customer", 422, "RELATIONSHIP_ERROR");
};

const buildEstimateData = (body, totals, existing = {}) => {
  const discount = Number(body.defaultDiscount ?? body.discount ?? existing.discount ?? 0);
  return {
    estimateNumber: body.estimateNumber ?? existing.estimateNumber,
    customerId: body.customerId ?? existing.customerId,
    vehicleId: body.vehicleId ?? existing.vehicleId,
    status: body.status ?? existing.status ?? "Draft",
    subtotal: totals.subtotal,
    vatPercentage: Number(body.vatPercentage ?? existing.vatPercentage ?? 20),
    vatAmount: totals.vatAmount,
    discount,
    defaultDiscount: discount,
    total: totals.total,
    notes: body.notes ?? existing.notes ?? null,
    validUntil: body.validUntil === "" ? null : (body.validUntil ?? existing.validUntil ?? null),
    estimateDate: body.estimateDate ?? existing.estimateDate,
    documentType: body.documentType === "" ? null : (body.documentType ?? existing.documentType ?? "Estimate"),
    labourRate: totals.labourCharge,
    jobNumber: body.jobNumber === "" ? null : (body.jobNumber ?? existing.jobNumber ?? createDocumentNumber("JOB")),
    customerOrderNumber: body.customerOrderNumber === "" ? null : (body.customerOrderNumber ?? existing.customerOrderNumber ?? null),
    serviceAdvisor: body.serviceAdvisor === "" ? null : (body.serviceAdvisor ?? existing.serviceAdvisor ?? null),
    vehicleMileage: body.vehicleMileage === "" ? null : (body.vehicleMileage ?? existing.vehicleMileage ?? null),
    creditTerms: body.creditTerms === "" ? null : (body.creditTerms ?? existing.creditTerms ?? null),
  };
};

export const createEstimate = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    await ensureRelations(req.body.customerId, req.body.vehicleId, transaction);
    const discount = Number(req.body.defaultDiscount ?? req.body.discount ?? 0);
    const totals = calculateDocumentTotals({ items: req.body.items, vatPercentage: req.body.vatPercentage, discount, labourCharge: req.body.labourRate });
    const estimate = await Estimate.create(buildEstimateData(req.body, totals), { transaction });
    await EstimateItem.bulkCreate(totals.items.map((item) => ({ ...item, estimateId: estimate.id })), { transaction });
    await transaction.commit();
    const result = await Estimate.findByPk(estimate.id, { include: includeEstimate });
    res.status(201).json({ success: true, message: "Estimate created successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const getEstimates = asyncHandler(async (req, res) => {
  const { search, status, customerId, vehicleId, page, limit } = req.query;
  const where = {};
  if (status) where.status = status;
  if (customerId) where.customerId = customerId;
  if (vehicleId) where.vehicleId = vehicleId;
  if (search) where[Op.or] = ["estimateNumber", "jobNumber", "customerOrderNumber", "serviceAdvisor"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));
  const { rows, count } = await Estimate.findAndCountAll({ where, include: includeEstimate, order: [["createdAt", "DESC"]], limit, offset: (page - 1) * limit, distinct: true });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getEstimateById = asyncHandler(async (req, res) => {
  const estimate = await Estimate.findByPk(req.params.id, { include: includeEstimate });
  if (!estimate) throw new AppError("Estimate not found", 404);
  res.json({ success: true, data: estimate });
});

export const updateEstimate = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const estimate = await Estimate.findByPk(req.params.id, { include: [{ model: EstimateItem, as: "items" }], transaction, lock: transaction.LOCK.UPDATE });
    if (!estimate) throw new AppError("Estimate not found", 404);
    const commercialFields = ["customerId", "vehicleId", "items", "vatPercentage", "discount", "defaultDiscount", "labourRate", "vehicleMileage", "estimateNumber"];
    if (estimate.status === "Approved" && commercialFields.some((field) => Object.prototype.hasOwnProperty.call(req.body, field))) {
      throw new AppError("Approved estimates cannot have commercial details changed", 409, "APPROVED_ESTIMATE_LOCKED");
    }

    const customerId = req.body.customerId ?? estimate.customerId;
    const vehicleId = req.body.vehicleId ?? estimate.vehicleId;
    await ensureRelations(customerId, vehicleId, transaction);
    const items = req.body.items ?? estimate.items.map((item) => item.toJSON());
    const discount = Number(req.body.defaultDiscount ?? req.body.discount ?? estimate.discount ?? 0);
    const vatPercentage = Number(req.body.vatPercentage ?? estimate.vatPercentage ?? 20);
    const labourRate = Number(req.body.labourRate ?? estimate.labourRate ?? 0);
    const totals = calculateDocumentTotals({ items, vatPercentage, discount, labourCharge: labourRate });

    await estimate.update(buildEstimateData({ ...req.body, customerId, vehicleId }, totals, estimate.toJSON()), { transaction });
    if (req.body.items) {
      await EstimateItem.destroy({ where: { estimateId: estimate.id }, transaction });
      await EstimateItem.bulkCreate(totals.items.map((item) => ({ ...item, estimateId: estimate.id })), { transaction });
    }
    await transaction.commit();
    const result = await Estimate.findByPk(estimate.id, { include: includeEstimate });
    res.json({ success: true, message: "Estimate updated successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const deleteEstimate = asyncHandler(async (req, res) => {
  const estimate = await Estimate.findByPk(req.params.id, { include: [{ model: JobSheet, as: "jobSheet", required: false }] });
  if (!estimate) throw new AppError("Estimate not found", 404);
  if (estimate.jobSheet) throw new AppError("Estimate cannot be deleted because a job sheet has already been created", 409, "LINKED_JOB_SHEET");
  await estimate.destroy();
  res.json({ success: true, message: "Estimate deleted successfully" });
});

export const updateStatusEstimate = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const estimate = await Estimate.findByPk(req.params.id, { include: [{ model: EstimateItem, as: "items" }], transaction, lock: transaction.LOCK.UPDATE });
    if (!estimate) throw new AppError("Estimate not found", 404);

    let jobSheet = await JobSheet.findOne({ where: { estimateId: estimate.id }, transaction });
    if (jobSheet && req.body.status !== "Approved") {
      throw new AppError("An approved estimate with a job sheet cannot be moved to another status", 409, "APPROVED_ESTIMATE_LOCKED");
    }
    if (req.body.status === "Approved" && !jobSheet) {
      await estimate.update({ status: "Approved", approvedAt: new Date() }, { transaction });
      jobSheet = await JobSheet.create({
        jobNumber: estimate.jobNumber || createDocumentNumber("JOB"),
        estimateId: estimate.id,
        customerId: estimate.customerId,
        vehicleId: estimate.vehicleId,
        vehicleMileage: estimate.vehicleMileage,
        serviceAdvisor: estimate.serviceAdvisor,
        subtotal: estimate.subtotal,
        labourRate: estimate.labourRate,
        vatPercentage: estimate.vatPercentage,
        vatAmount: estimate.vatAmount,
        discount: estimate.discount,
        total: estimate.total,
        status: "Open",
        priority: "Medium",
      }, { transaction });
      await JobSheetItem.bulkCreate(estimate.items.map((item) => ({
        jobSheetId: jobSheet.id,
        itemType: item.itemType,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vat: item.vat,
        totalPrice: item.totalPrice,
      })), { transaction });
    } else {
      await estimate.update({ status: req.body.status, approvedAt: req.body.status === "Approved" ? (estimate.approvedAt || new Date()) : null }, { transaction });
    }

    await transaction.commit();
    const result = await Estimate.findByPk(estimate.id, { include: includeEstimate });
    res.json({ success: true, message: req.body.status === "Approved" ? "Estimate approved and job sheet created" : `Estimate marked as ${req.body.status}`, data: result, jobSheet });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});
