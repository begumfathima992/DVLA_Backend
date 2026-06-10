import { Router } from "express";
import {
  createEstimate,
  getEstimates,
  getEstimateById,
  updateEstimate,
  deleteEstimate,
  updateStatusEstimate,
} from "../controller/EstimateController.js";

const router = Router();

router.post("/", createEstimate);

router.get("/", getEstimates);

router.get("/:id", getEstimateById);

router.put("/:id", updateEstimate);

router.delete("/:id", deleteEstimate);

router.post("/status/:id", updateStatusEstimate);

export default router;
