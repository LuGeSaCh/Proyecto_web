// src/app.js (ESM)
import express from "express";
import cors from "cors";

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Endpoint de ejemplo
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

export default app;
