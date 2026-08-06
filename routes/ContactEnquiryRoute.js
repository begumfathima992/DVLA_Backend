import { Router } from "express";
import { createContactEnquiry, deleteContactEnquiry, getContactEnquiries, getContactEnquiryById, updateContactEnquiry } from "../controller/ContactEnquiryController.js";
import { allowRoles, auth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { contactListSchema, contactParamsSchema, createContactSchema, updateContactSchema } from "../validation/contact.validation.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
const contactLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10, message: "Too many enquiries from this connection; please try again later" });
router.post("/", contactLimiter, validate(createContactSchema), createContactEnquiry);
router.get("/", auth, allowRoles("Admin", "Manager"), validate(contactListSchema, "query"), getContactEnquiries);
router.get("/:id", auth, allowRoles("Admin", "Manager"), validate(contactParamsSchema, "params"), getContactEnquiryById);
router.patch("/:id", auth, allowRoles("Admin", "Manager"), validate(contactParamsSchema, "params"), validate(updateContactSchema), updateContactEnquiry);
router.delete("/:id", auth, allowRoles("Admin", "Manager"), validate(contactParamsSchema, "params"), deleteContactEnquiry);
export default router;
