import { Router } from "express";
import CustomerRoute from "./CustomerRoute.js";
import VehicleRoute from "./VehicleRoute.js";
import EstimateRoute from "./EstimateRoute.js";
import AuthRoute from "./authRoute.js";
import dvlaRoute from "./dvlaRoute.js";

const router = Router();

router.use("/customer", CustomerRoute);
router.use("/vehicle", VehicleRoute);
router.use("/estimate", EstimateRoute);

router.use("/auth", AuthRoute); // New auth route for login/logout
router.use("/dvla", dvlaRoute);


export default router;
