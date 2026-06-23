import { Router } from "express";
import CustomerRoute from "./CustomerRoute.js";
import VehicleRoute from "./VehicleRoute.js";
import EstimateRoute from "./EstimateRoute.js";
import AuthRoute from "./authRoute.js";
import dvlaRoute from "./dvlaRoute.js";
import JobSheetRoute from "./JobSheetRoute.js";
import SettingRoute from "./SettingRoute.js";

const router = Router();

router.use("/customer", CustomerRoute);
router.use("/vehicle", VehicleRoute);
router.use("/estimate", EstimateRoute);

router.use("/auth", AuthRoute);
router.use("/dvla", dvlaRoute);
router.use("/jobSheets", JobSheetRoute);
router.use("/settings", SettingRoute);

export default router;
