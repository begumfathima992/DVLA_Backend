import { Op } from "sequelize";
import { Customer, Estimate, Invoice, InvoiceItem, InvoicePayment, JobSheet, JobSheetItem, User, Vehicle, sequelize } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateDocumentTotals } from "../utils/documentTotals.js";
import { createDocumentNumber } from "../utils/documentNumber.js";

const includeInvoice = [
  { model: InvoiceItem, as: "items" },
  { model: InvoicePayment, as: "payments", include: [{ model: User, as: "recordedBy", attributes: ["id", "name", "email"] }] },
  { model: Customer, as: "customerRecord", required: false },
  { model: Vehicle, as: "vehicleRecord", required: false },
  { model: Estimate, as: "estimate", required: false },
  { model: JobSheet, as: "jobSheet", required: false },
];

const findInvoice = async (identifier, options = {}) => {
  const numeric = Number(identifier);
  const where = Number.isInteger(numeric) && String(numeric) === String(identifier)
    ? { [Op.or]: [{ id: numeric }, { invoiceNumber: String(identifier) }] }
    : { invoiceNumber: String(identifier) };
  return Invoice.findOne({ where, ...options });
};

const statusFromBalance = (requestedStatus, balance, paidAmount, total) => {
  if (requestedStatus === "Void") return "Void";
  if (balance <= 0 && total > 0) return "Paid";
  if (paidAmount > 0) return "Partial";
  if (requestedStatus === "Overdue") return "Overdue";
  return requestedStatus === "Draft" ? "Draft" : "Unpaid";
};

const effectiveValue = (body, existing, key, fallback = null) =>
  Object.prototype.hasOwnProperty.call(body, key) ? body[key] : (existing[key] ?? fallback);

const ensureInvoiceRelations = async (body, existing = {}, transaction) => {
  const customerId = effectiveValue(body, existing, "customerId");
  const vehicleId = effectiveValue(body, existing, "vehicleId");
  const estimateId = effectiveValue(body, existing, "estimateId");
  const jobSheetId = effectiveValue(body, existing, "jobSheetId");

  const [customer, vehicle, estimate, jobSheet] = await Promise.all([
    customerId ? Customer.findByPk(customerId, { transaction }) : null,
    vehicleId ? Vehicle.findByPk(vehicleId, { transaction }) : null,
    estimateId ? Estimate.findByPk(estimateId, { transaction }) : null,
    jobSheetId ? JobSheet.findByPk(jobSheetId, { transaction }) : null,
  ]);

  if (customerId && !customer) throw new AppError("Customer not found", 404);
  if (vehicleId && !vehicle) throw new AppError("Vehicle not found", 404);
  if (estimateId && !estimate) throw new AppError("Estimate not found", 404);
  if (jobSheetId && !jobSheet) throw new AppError("Job sheet not found", 404);
  if (customerId && vehicle && Number(vehicle.customerId) !== Number(customerId)) {
    throw new AppError("Selected vehicle does not belong to the selected customer", 422, "RELATIONSHIP_ERROR");
  }
  if (estimate && ((customerId && Number(estimate.customerId) !== Number(customerId)) || (vehicleId && Number(estimate.vehicleId) !== Number(vehicleId)))) {
    throw new AppError("Estimate does not match the selected customer or vehicle", 422, "RELATIONSHIP_ERROR");
  }
  if (jobSheet && ((customerId && Number(jobSheet.customerId) !== Number(customerId)) || (vehicleId && Number(jobSheet.vehicleId) !== Number(vehicleId)))) {
    throw new AppError("Job sheet does not match the selected customer or vehicle", 422, "RELATIONSHIP_ERROR");
  }
};

const buildData = (body, totals, existing = {}) => {
  const paidAmount = Number(body.paidAmount ?? existing.paidAmount ?? 0);
  const balance = Math.max(0, Math.round((totals.total - paidAmount + Number.EPSILON) * 100) / 100);
  const status = statusFromBalance(body.status ?? existing.status ?? "Draft", balance, paidAmount, totals.total);
  return {
    invoiceNumber: body.invoiceNumber ?? existing.invoiceNumber,
    customerId: effectiveValue(body, existing, "customerId"),
    vehicleId: effectiveValue(body, existing, "vehicleId"),
    estimateId: effectiveValue(body, existing, "estimateId"),
    jobSheetId: effectiveValue(body, existing, "jobSheetId"),
    customerName: body.customerName ?? existing.customerName,
    vehicleRegistration: body.vehicleRegistration ?? existing.vehicleRegistration,
    vehicleDescription: body.vehicleDescription ?? existing.vehicleDescription ?? null,
    invoiceDate: body.invoiceDate ?? existing.invoiceDate,
    dueDate: body.dueDate === "" ? null : (body.dueDate ?? existing.dueDate ?? null),
    status,
    paidAmount,
    paymentDate: paidAmount > 0
      ? (body.paymentDate ?? existing.paymentDate ?? new Date().toISOString().slice(0, 10))
      : (body.paymentDate ?? existing.paymentDate ?? null),
    paymentMethod: body.paymentMethod ?? existing.paymentMethod ?? null,
    subtotal: totals.subtotal,
    vatPercentage: Number(body.vatPercentage ?? existing.vatPercentage ?? 20),
    vatAmount: totals.vatAmount,
    discount: totals.discount,
    labourCharge: totals.labourCharge,
    total: totals.total,
    balance,
    notes: body.notes ?? existing.notes ?? null,
  };
};

export const createInvoice = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    await ensureInvoiceRelations(req.body, {}, transaction);
    const totals = calculateDocumentTotals({ items: req.body.items, vatPercentage: req.body.vatPercentage, discount: req.body.discount, labourCharge: req.body.labourCharge });
    if (Number(req.body.paidAmount || 0) > totals.total) throw new AppError("Paid amount cannot exceed invoice total", 422, "OVERPAYMENT");
    const invoice = await Invoice.create(buildData(req.body, totals), { transaction });
    await InvoiceItem.bulkCreate(totals.items.map((item) => ({ ...item, invoiceId: invoice.id })), { transaction });
    if (Number(invoice.paidAmount) > 0) {
      await InvoicePayment.create({
        invoiceId: invoice.id,
        amount: invoice.paidAmount,
        paymentDate: invoice.paymentDate || invoice.invoiceDate,
        paymentMethod: invoice.paymentMethod || "Other",
        notes: "Opening payment recorded with invoice",
        createdBy: req.user?.id || null,
      }, { transaction });
    }
    await transaction.commit();
    const result = await Invoice.findByPk(invoice.id, { include: includeInvoice });
    res.status(201).json({ success: true, message: "Invoice created successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const getInvoices = asyncHandler(async (req, res) => {
  const { search, status, customerId, vehicleId, page, limit } = req.query;
  const where = {};
  if (status) where.status = status;
  if (customerId) where.customerId = customerId;
  if (vehicleId) where.vehicleId = vehicleId;
  if (search) where[Op.or] = ["invoiceNumber", "customerName", "vehicleRegistration", "vehicleDescription"].map((field) => ({ [field]: { [Op.like]: `%${search}%` } }));
  const { rows, count } = await Invoice.findAndCountAll({ where, include: includeInvoice, order: [["invoiceDate", "DESC"], ["createdAt", "DESC"]], limit, offset: (page - 1) * limit, distinct: true });
  res.json({ success: true, data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await findInvoice(req.params.id, { include: includeInvoice });
  if (!invoice) throw new AppError("Invoice not found", 404);
  res.json({ success: true, data: invoice });
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const invoice = await findInvoice(req.params.id, { include: [{ model: InvoiceItem, as: "items" }], transaction, lock: transaction.LOCK.UPDATE });
    if (!invoice) throw new AppError("Invoice not found", 404);
    if (invoice.status === "Void") throw new AppError("Void invoices cannot be edited", 409, "VOID_INVOICE_LOCKED");
    await ensureInvoiceRelations(req.body, invoice.toJSON(), transaction);
    const items = req.body.items ?? invoice.items.map((item) => item.toJSON());
    const totals = calculateDocumentTotals({ items, vatPercentage: req.body.vatPercentage ?? invoice.vatPercentage, discount: req.body.discount ?? invoice.discount, labourCharge: req.body.labourCharge ?? invoice.labourCharge });
    const previousPaid = Number(invoice.paidAmount || 0);
    const nextData = buildData(req.body, totals, invoice.toJSON());
    if (Number(nextData.paidAmount) > totals.total) throw new AppError("Paid amount cannot exceed invoice total", 422, "OVERPAYMENT");
    if (Number(nextData.paidAmount) < previousPaid) throw new AppError("Paid amount cannot be reduced from the invoice editor", 409, "PAYMENT_HISTORY_LOCKED");
    if (nextData.status === "Void" && previousPaid > 0) throw new AppError("An invoice with payments cannot be voided", 409, "PAID_INVOICE_LOCKED");
    await invoice.update(nextData, { transaction });
    if (Number(nextData.paidAmount) > previousPaid) {
      await InvoicePayment.create({
        invoiceId: invoice.id,
        amount: Number(nextData.paidAmount) - previousPaid,
        paymentDate: nextData.paymentDate || new Date().toISOString().slice(0, 10),
        paymentMethod: nextData.paymentMethod || "Other",
        notes: "Payment adjustment recorded from invoice editor",
        createdBy: req.user?.id || null,
      }, { transaction });
    }
    if (req.body.items) {
      await InvoiceItem.destroy({ where: { invoiceId: invoice.id }, transaction });
      await InvoiceItem.bulkCreate(totals.items.map((item) => ({ ...item, invoiceId: invoice.id })), { transaction });
    }
    await transaction.commit();
    const result = await Invoice.findByPk(invoice.id, { include: includeInvoice });
    res.json({ success: true, message: "Invoice updated successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await findInvoice(req.params.id);
  if (!invoice) throw new AppError("Invoice not found", 404);
  if (Number(invoice.paidAmount) > 0) throw new AppError("Invoices with payments cannot be deleted; mark the invoice as Void instead", 409, "PAID_INVOICE_LOCKED");
  await invoice.destroy();
  res.json({ success: true, message: "Invoice deleted successfully" });
});

export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const invoice = await findInvoice(req.params.id);
  if (!invoice) throw new AppError("Invoice not found", 404);
  if (req.body.status === "Void" && Number(invoice.paidAmount) > 0) throw new AppError("An invoice with payments cannot be voided", 409, "PAID_INVOICE_LOCKED");
  const status = statusFromBalance(req.body.status, Number(invoice.balance), Number(invoice.paidAmount), Number(invoice.total));
  await invoice.update({ status });
  res.json({ success: true, message: `Invoice marked as ${status}`, data: invoice });
});

export const addInvoicePayment = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const invoice = await findInvoice(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!invoice) throw new AppError("Invoice not found", 404);
    if (invoice.status === "Void") throw new AppError("Payments cannot be added to a void invoice", 409);
    const paidAmount = Math.round((Number(invoice.paidAmount) + Number(req.body.amount) + Number.EPSILON) * 100) / 100;
    if (paidAmount > Number(invoice.total)) throw new AppError("Payment exceeds the outstanding invoice total", 422, "OVERPAYMENT");
    const balance = Math.max(0, Math.round((Number(invoice.total) - paidAmount + Number.EPSILON) * 100) / 100);
    const status = balance <= 0 ? "Paid" : "Partial";
    await InvoicePayment.create({
      invoiceId: invoice.id,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      paymentMethod: req.body.paymentMethod,
      reference: req.body.reference || null,
      notes: req.body.notes || null,
      createdBy: req.user?.id || null,
    }, { transaction });
    await invoice.update({ paidAmount, balance, status, paymentDate: req.body.paymentDate, paymentMethod: req.body.paymentMethod }, { transaction });
    await transaction.commit();
    const result = await Invoice.findByPk(invoice.id, { include: includeInvoice });
    res.json({ success: true, message: "Payment recorded successfully", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});

export const createInvoiceFromJobSheet = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const jobSheet = await JobSheet.findByPk(req.params.jobSheetId, {
      include: [
        { model: Customer, as: "customer" },
        { model: Vehicle, as: "vehicle" },
        { model: Estimate, as: "estimate" },
        { model: JobSheetItem, as: "items" },
        { model: Invoice, as: "invoice", required: false },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!jobSheet) throw new AppError("Job sheet not found", 404);
    if (jobSheet.invoice) throw new AppError("An invoice already exists for this job sheet", 409, "CONFLICT");

    const totals = calculateDocumentTotals({ items: jobSheet.items, vatPercentage: jobSheet.vatPercentage, discount: jobSheet.discount, labourCharge: jobSheet.labourRate });
    const invoiceDate = new Date().toISOString().slice(0, 10);
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const invoice = await Invoice.create(buildData({
      invoiceNumber: createDocumentNumber("INV"),
      customerId: jobSheet.customerId,
      vehicleId: jobSheet.vehicleId,
      estimateId: jobSheet.estimateId,
      jobSheetId: jobSheet.id,
      customerName: jobSheet.customer.name,
      vehicleRegistration: jobSheet.vehicle.registrationNumber,
      vehicleDescription: `${jobSheet.vehicle.make} ${jobSheet.vehicle.model}`.trim(),
      invoiceDate,
      dueDate,
      status: "Unpaid",
      vatPercentage: jobSheet.vatPercentage,
      discount: jobSheet.discount,
      notes: jobSheet.notes,
    }, totals), { transaction });
    await InvoiceItem.bulkCreate(totals.items.map((item) => ({ ...item, invoiceId: invoice.id })), { transaction });
    await transaction.commit();
    const result = await Invoice.findByPk(invoice.id, { include: includeInvoice });
    res.status(201).json({ success: true, message: "Invoice created from job sheet", data: result });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
});
