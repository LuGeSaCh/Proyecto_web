// Ejemplo para un nuevo controlador: server/src/controllers/alquileres.controller.js
import { pool } from "../config/db.js";

export const createRental = async (req, res) => {
  const { vehiculoId, clienteId, fechaInicio, fechaFin, total } = req.body;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Crear el registro del alquiler
    await connection.query(
      "INSERT INTO Alquileres (vehiculoId, clienteId, fechaInicio, fechaFin, precioTotal, estado) VALUES (?, ?, ?, ?, ?, 'confirmado')",
      [vehiculoId, clienteId, fechaInicio, fechaFin, total]
    );

    // 2. Actualizar el estado del vehículo a 'no disponible'
    await connection.query(
      "UPDATE Vehiculos SET activo = 0 WHERE id = ?",
      [vehiculoId]
    );

    await connection.commit();
    res.json({ message: "Renta exitosa. El vehículo ha sido reservado y ocultado del catálogo." });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};