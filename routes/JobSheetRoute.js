import express from "express";
import JobSheetController from "../controller/JobSheetController.js";

const router = express.Router();

router.get("/", JobSheetController.getJobSheets);
router.put("/:id", JobSheetController.updateJobSheet);

router.patch("/priority/:id", JobSheetController.updateJobSheetPriority);
router.patch("/status/:id", JobSheetController.updateJobSheetStatus);

export default router;
