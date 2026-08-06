import { Router } from "express";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controller/CustomerController.js";
import { validate } from "../middleware/validate.js";
import { createCustomerSchema, customerListSchema, customerParamsSchema, updateCustomerSchema } from "../validation/customer.validation.js";

const router = Router();
router.get("/", validate(customerListSchema, "query"), getCustomers);
router.post("/", validate(createCustomerSchema), createCustomer);
router.get("/:id", validate(customerParamsSchema, "params"), getCustomerById);
router.put("/:id", validate(customerParamsSchema, "params"), validate(updateCustomerSchema), updateCustomer);
router.patch("/:id", validate(customerParamsSchema, "params"), validate(updateCustomerSchema), updateCustomer);
router.delete("/:id", validate(customerParamsSchema, "params"), deleteCustomer);
export default router;
