import { Router } from "express";
import { createRental, getMyRentals } from "../controllers/rentas.controller.js";
// Si estás usando el Mock global en app.js, no necesitas importar authRequired aquí.
// Si NO usas el Mock global, descomenta e importa authRequired.

const router = Router();

// POST: Crear una reserva
router.post("/rentals", createRental);
// GET: Obtener mis reservas
router.get("/rentals", getMyRentals);

export default router;