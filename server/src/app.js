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
app.get("/api/cars", (req, res) => {
  const cars = [
    { id: 1, make: "Toyota", model: "Corolla", year: 2020, pricePerDay: 40, imageURL: "https://i.blogs.es/e5d8bc/toyota-corolla-2020_/1366_2000.jpg" },
    { id: 2, make: "Ford", model: "Mustang", year: 2021, pricePerDay: 60, imageURL: "https://media.ed.edmunds-media.com/ford/mustang/2021/ns/2021_ford_mustang_f34_ns_506211_1600.jpg" },
    { id: 3, make: "Chevrolet", model: "Camaro", year: 2019, pricePerDay: 50, imageURL: "https://di-uploads-pod1.dealerinspire.com/mikeandersonchevychicagoredesign/uploads/2019/04/2019-Camaro-1LT.png" },
  ];
  res.json({ cars });
});

export default app;
