import { Router } from "express";
import { createVehicle, deleteVehicle, getVehicleById, getVehicles, getVehiclesByCustomer, updateVehicle } from "../controller/VehicleController.js";
import { validate } from "../middleware/validate.js";
import { createVehicleSchema, customerVehicleParamsSchema, updateVehicleSchema, vehicleListSchema, vehicleParamsSchema } from "../validation/vehicle.validation.js";

const router = Router();
router.get("/", validate(vehicleListSchema, "query"), getVehicles);
router.post("/", validate(createVehicleSchema), createVehicle);
router.get("/customer/:customerId", validate(customerVehicleParamsSchema, "params"), getVehiclesByCustomer);
router.get("/:id", validate(vehicleParamsSchema, "params"), getVehicleById);
router.put("/:id", validate(vehicleParamsSchema, "params"), validate(updateVehicleSchema), updateVehicle);
router.patch("/:id", validate(vehicleParamsSchema, "params"), validate(updateVehicleSchema), updateVehicle);
router.delete("/:id", validate(vehicleParamsSchema, "params"), deleteVehicle);
export default router;
