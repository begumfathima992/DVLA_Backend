import { Router } from "express";
import { createEstimate, deleteEstimate, getEstimateById, getEstimates, updateEstimate, updateStatusEstimate } from "../controller/EstimateController.js";
import { validate } from "../middleware/validate.js";
import { createEstimateSchema, estimateListSchema, estimateParamsSchema, estimateStatusSchema, updateEstimateSchema } from "../validation/estimate.validation.js";

const router = Router();
router.get("/", validate(estimateListSchema, "query"), getEstimates);
router.post("/", validate(createEstimateSchema), createEstimate);
router.post("/status/:id", validate(estimateParamsSchema, "params"), validate(estimateStatusSchema), updateStatusEstimate);
router.patch("/:id/status", validate(estimateParamsSchema, "params"), validate(estimateStatusSchema), updateStatusEstimate);
router.get("/:id", validate(estimateParamsSchema, "params"), getEstimateById);
router.put("/:id", validate(estimateParamsSchema, "params"), validate(updateEstimateSchema), updateEstimate);
router.patch("/:id", validate(estimateParamsSchema, "params"), validate(updateEstimateSchema), updateEstimate);
router.delete("/:id", validate(estimateParamsSchema, "params"), deleteEstimate);
export default router;
