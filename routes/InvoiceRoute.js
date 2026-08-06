import { Router } from "express";
import { addInvoicePayment, createInvoice, createInvoiceFromJobSheet, deleteInvoice, getInvoiceById, getInvoices, updateInvoice, updateInvoiceStatus } from "../controller/InvoiceController.js";
import { validate } from "../middleware/validate.js";
import { createInvoiceSchema, fromJobSheetParamsSchema, invoiceListSchema, invoiceParamsSchema, invoicePaymentSchema, invoiceStatusSchema, updateInvoiceSchema } from "../validation/invoice.validation.js";

const router = Router();
router.get("/", validate(invoiceListSchema, "query"), getInvoices);
router.post("/", validate(createInvoiceSchema), createInvoice);
router.post("/from-job-sheet/:jobSheetId", validate(fromJobSheetParamsSchema, "params"), createInvoiceFromJobSheet);
router.post("/:id/payment", validate(invoiceParamsSchema, "params"), validate(invoicePaymentSchema), addInvoicePayment);
router.patch("/:id/status", validate(invoiceParamsSchema, "params"), validate(invoiceStatusSchema), updateInvoiceStatus);
router.get("/:id", validate(invoiceParamsSchema, "params"), getInvoiceById);
router.put("/:id", validate(invoiceParamsSchema, "params"), validate(updateInvoiceSchema), updateInvoice);
router.patch("/:id", validate(invoiceParamsSchema, "params"), validate(updateInvoiceSchema), updateInvoice);
router.delete("/:id", validate(invoiceParamsSchema, "params"), deleteInvoice);
export default router;
