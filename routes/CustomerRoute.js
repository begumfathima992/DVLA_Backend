import { Router } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controller/CustomerController.js";

const router = Router();

router.post("/", createCustomer);

router.get("/", getCustomers);

router.get("/:id", getCustomerById);

router.put("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

export default router;
