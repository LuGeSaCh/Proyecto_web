// server/src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Importar cookie-parser
import carrosRoutes from "./routes/carros.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import paymentsRoutes from "./routes/pagos.routes.js";
import rentalsRoutes from "./routes/rentas.routes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api", carrosRoutes);
app.use("/api", usuariosRoutes );
app.use("/api", paymentsRoutes);
app.use("/api", rentalsRoutes);

export default app;
