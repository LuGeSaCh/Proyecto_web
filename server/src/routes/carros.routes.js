// server/src/routes/cars.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { getCars, createCar, toggleCarAvailability, getMyCars } from "../controllers/carros.controller.js";
const router = Router();

// Obtener carros con filtros opcionales -> acceso público
router.get("/carros", getCars);

// Crear carros -> solo propietarios
router.post("/carros", authRequired, createCar);

// Obtener solo los carros del usuario logueado -> Panel de Control
router.get("/mis-carros", authRequired, getMyCars);
// Ruta para alternar la disponibilidad -> solo su propietario
router.patch("/carros/:id/disponibilidad", authRequired, toggleCarAvailability);


export default router;