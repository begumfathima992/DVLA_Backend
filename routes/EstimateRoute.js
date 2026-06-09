import { Router } from "express";
import {
  createEstimate,
  getEstimates,
  getEstimateById,
  updateEstimate,
  deleteEstimate,
  approveEstimate,
  rejectEstimate,
} from "../controller/EstimateController.js";

const router = Router();

router.post("/", createEstimate);

router.get("/", getEstimates);

router.get("/:id", getEstimateById);

router.put("/:id", updateEstimate);

router.delete("/:id", deleteEstimate);

router.patch("/approve/:id", approveEstimate);

router.patch("/reject/:id", rejectEstimate);

export default router;
