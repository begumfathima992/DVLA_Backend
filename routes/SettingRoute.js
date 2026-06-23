import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controller/SettingController.js";

const router = Router();

router.post("/", updateSettings);

router.get("/", getSettings);
export default router;
