import { Router } from "express";
import { login, register, logout, verifyEmail, getAllUsers, deleteUser } from "../controllers/usuarios.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", authRequired, logout);
router.post("/verify-email", verifyEmail);
router.get("/usuarios", getAllUsers);
router.delete("/usuarios/:id", deleteUser);

// router.get("/profile", authRequired, profile); // Esto lo habilitaremos luego cuando hagamos el middleware

export default router;