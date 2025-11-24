// server/src/routes/carros.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { getCars, createCar, toggleCarAvailability, getMyCars, getCarsNearMe } from "../controllers/carros.controller.js";

const router = Router();

// --- PÚBLICO ---
// Obtener catálogo general (filtra solo activos)
router.get("/carros", getCars);


// Obtener carros con filtros y cercanos al usuario logueado
router.get("/carros/cerca", authRequired, getCarsNearMe);

// --- PROPIETARIO (Requiere Auth) ---
// Publicar un nuevo carro
router.post("/carros", authRequired, createCar);

// Obtener MIS carros (visibles y ocultos) - Panel de control
router.get("/carros/propios", authRequired, getMyCars);

// Activar/Desactivar disponibilidad de MI carro
router.patch("/carros/propios/:id/disponibilidad", authRequired, toggleCarAvailability);

export default router;