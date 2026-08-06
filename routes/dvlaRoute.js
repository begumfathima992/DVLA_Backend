import { Router } from "express";
import { getVehicleLookupHistory, searchVehicle } from "../controller/DvlaController.js";
import { validate } from "../middleware/validate.js";
import { dvlaHistorySchema, dvlaSearchSchema } from "../validation/dvla.validation.js";
import { auth } from "../middleware/authMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
const lookupLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 60, message: "Vehicle lookup limit reached; please try again later" });
router.post("/search", lookupLimiter, validate(dvlaSearchSchema), searchVehicle);
router.get("/history", auth, validate(dvlaHistorySchema, "query"), getVehicleLookupHistory);
export default router;
