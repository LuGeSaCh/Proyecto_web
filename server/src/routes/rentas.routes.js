import { Router } from "express";
import { createRental } from "../controllers/rentas.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js"; 

const router = Router();

// POST: Crear una reserva (Ahora protegido con authRequired)
router.post("/rentals", authRequired, createRental);

/* GET: Obtener mis reservas (ejemplo futuro)
router.get("/rentals", authRequired, getMyRentals);
*/

export default router;