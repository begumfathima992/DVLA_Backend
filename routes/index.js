import { Router } from "express";
import AuthRoute from "./authRoute.js";
import CustomerRoute from "./CustomerRoute.js";
import VehicleRoute from "./VehicleRoute.js";
import EstimateRoute from "./EstimateRoute.js";
import JobSheetRoute from "./JobSheetRoute.js";
import SettingRoute from "./SettingRoute.js";
import InvoiceRoute from "./InvoiceRoute.js";
import ContactEnquiryRoute from "./ContactEnquiryRoute.js";
import dvlaRoute from "./dvlaRoute.js";
import UserRoute from "./UserRoute.js";
import { allowRoles, auth } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controller/DashboardController.js";
import { searchVehicle } from "../controller/DvlaController.js";
import { validate } from "../middleware/validate.js";
import { dvlaSearchSchema } from "../validation/dvla.validation.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
const publicVehicleLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 60, message: "Vehicle lookup limit reached; please try again later" });

router.use("/auth", AuthRoute);
router.use("/dvla", dvlaRoute);
router.post("/save-vehicle", publicVehicleLimiter, validate(dvlaSearchSchema), searchVehicle);
router.use("/contact-enquiries", ContactEnquiryRoute);
router.use("/contact", ContactEnquiryRoute);

router.get("/dashboard", auth, getDashboard);
router.use("/users", auth, allowRoles("Admin"), UserRoute);
router.get("/Dashboard", auth, getDashboard);
router.use("/customer", auth, CustomerRoute);
router.use("/vehicle", auth, VehicleRoute);
router.use("/estimate", auth, EstimateRoute);
router.use("/jobSheets", auth, JobSheetRoute);
router.use("/settings", auth, allowRoles("Admin", "Manager"), SettingRoute);
router.use("/invoices", auth, InvoiceRoute);
router.use("/invoice", auth, InvoiceRoute);

export default router;
