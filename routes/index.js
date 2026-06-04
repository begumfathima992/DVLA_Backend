import { Router } from "express";
import CustomerRoute from "./CustomerRoute.js";
import VehicleRoute from "./VehicleRoute.js";

const router = Router();

router.use("/customer", CustomerRoute);
router.use("/vehicle", VehicleRoute);
// router.get("/estimate", EstimateRoute);

export default router;
