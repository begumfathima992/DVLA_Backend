import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser, updateUserPassword } from "../controller/UserController.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, updatePasswordSchema, updateUserSchema, userListSchema, userParamsSchema } from "../validation/user.validation.js";

const router = Router();
router.get("/", validate(userListSchema, "query"), getUsers);
router.post("/", validate(createUserSchema), createUser);
router.patch("/:id", validate(userParamsSchema, "params"), validate(updateUserSchema), updateUser);
router.patch("/:id/password", validate(userParamsSchema, "params"), validate(updatePasswordSchema), updateUserPassword);
router.delete("/:id", validate(userParamsSchema, "params"), deleteUser);
export default router;
