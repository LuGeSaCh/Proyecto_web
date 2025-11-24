import { pool } from "../config/db.js";

export const createRental = async (req, res) => {
  // 1. SEGURIDAD: Obtenemos el clienteId del usuario autenticado (Token)
  const clienteId = req.user.id; 
  
  // Ya no pedimos clienteId en el body
  const { vehiculoId, fechaInicio, fechaFin, total } = req.body;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verificar si el carro sigue activo antes de intentar nada
    const [carro] = await connection.query(
        "SELECT activo FROM Vehiculos WHERE id = ? FOR UPDATE", 
        [vehiculoId]
    );
    if (carro.length === 0 || carro[0].activo === 0) {
        await connection.rollback();
        return res.status(409).json({ message: "El vehículo ya no está disponible." });
    }

    // 2. ESTADO: Creamos la renta en estado 'pendiente'
    // Solo pasará a 'confirmado' cuando se ejecute el controlador de pagos
    const [renta] = await connection.query(
      "INSERT INTO Alquileres (vehiculoId, clienteId, fechaInicio, fechaFin, precioTotal, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')",
      [vehiculoId, clienteId, fechaInicio, fechaFin, total]
    );

    // Bloqueamos el vehículo inmediatamente 
    await connection.query(
      "UPDATE Vehiculos SET activo = 0 WHERE id = ?",
      [vehiculoId]
    );

    await connection.commit();
    
    // Devolvemos el ID de la renta para que el Frontend pueda enviarlo al endpoint de Pagos
    res.json({ 
        message: "Reserva iniciada. Procede al pago para confirmar.", 
        alquilerId: renta.insertId 
    });

  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};