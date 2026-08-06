import { Router } from "express";
import { login, logout, me, register } from "../controller/authController.js";
import { auth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { createRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many authentication attempts; please try again later" });
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);
export default router;
