import { createPool } from "mysql2/promise";
import dotenv from "dotenv/config";

// Crea la conexion usando Pool
export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: "RentadosDB",
});

// Funcion para verificar conexion al iniciar
export async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("Error de conexión a MySQL:", error);
  }
}