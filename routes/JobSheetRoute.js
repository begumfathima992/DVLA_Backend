import { Router } from "express";
import { createJobSheet, getJobSheetById, getJobSheets, updateJobSheet, updateJobSheetPriority, updateJobSheetStatus } from "../controller/JobSheetController.js";
import { validate } from "../middleware/validate.js";
import { createJobSheetSchema, jobPrioritySchema, jobSheetListSchema, jobSheetParamsSchema, jobStatusSchema, updateJobSheetSchema } from "../validation/jobSheet.validation.js";

const router = Router();
router.get("/", validate(jobSheetListSchema, "query"), getJobSheets);
router.post("/", validate(createJobSheetSchema), createJobSheet);
router.post("/priority/:id", validate(jobSheetParamsSchema, "params"), validate(jobPrioritySchema), updateJobSheetPriority);
router.patch("/:id/priority", validate(jobSheetParamsSchema, "params"), validate(jobPrioritySchema), updateJobSheetPriority);
router.post("/status/:id", validate(jobSheetParamsSchema, "params"), validate(jobStatusSchema), updateJobSheetStatus);
router.patch("/:id/status", validate(jobSheetParamsSchema, "params"), validate(jobStatusSchema), updateJobSheetStatus);
router.get("/:id", validate(jobSheetParamsSchema, "params"), getJobSheetById);
router.put("/:id", validate(jobSheetParamsSchema, "params"), validate(updateJobSheetSchema), updateJobSheet);
router.patch("/:id", validate(jobSheetParamsSchema, "params"), validate(updateJobSheetSchema), updateJobSheet);
export default router;
