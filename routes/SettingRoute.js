import { Router } from "express";
import { getSettings, updateSettings } from "../controller/SettingController.js";
import { validate } from "../middleware/validate.js";
import { settingSchema } from "../validation/setting.validation.js";

const router = Router();
router.get("/", getSettings);
router.post("/", validate(settingSchema), updateSettings);
router.put("/", validate(settingSchema), updateSettings);
export default router;
