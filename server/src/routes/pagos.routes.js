import { Router } from "express";
import { createPayment, getInvoice } from "../controllers/pagos.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js"; // Descomentar si quieres protegerlo

const router = Router();


router.post("/pagos", authRequired, createPayment);
router.get("/pagos/:id/invoice", authRequired, getInvoice);

export default router;