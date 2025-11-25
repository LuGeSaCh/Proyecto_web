import { pool } from "../config/db.js";

//  Crear Renta
export const createRental = async (req, res) => {
  //Obtenemos el clienteId del usuario autenticado (Token)
  const clienteId = req.user.id;

  const { vehiculoId, fechaInicio, fechaFin, total } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verifica si el carro sigue activo antes de intentar algo
    const [carro] = await connection.query(
      "SELECT activo FROM Vehiculos WHERE id = ? FOR UPDATE",
      [vehiculoId]
    );
    if (carro.length === 0 || carro[0].activo === 0) {
      await connection.rollback();
      return res.status(409).json({ message: "El vehículo ya no está disponible." });
    }

    //Estado para la renta en estado 'pendiente'
    const [renta] = await connection.query(
      "INSERT INTO Alquileres (vehiculoId, clienteId, fechaInicio, fechaFin, precioTotal, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')",
      [vehiculoId, clienteId, fechaInicio, fechaFin, total]
    );

    // Bloquea el carro inmediatamente 
    await connection.query(
      "UPDATE Vehiculos SET activo = 0 WHERE id = ?",
      [vehiculoId]
    );

    await connection.commit();

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

//Obtener Mis Rentas
export const getMyRentals = async (req, res) => {
  const userId = req.user.id; //Viene del token

  try {
    const query = `
      SELECT 
        a.id, a.fechaInicio, a.fechaFin, a.precioTotal, a.estado,
        v.marca, v.modelo, v.imagenURL, v.anio
      FROM Alquileres a
      INNER JOIN Vehiculos v ON a.vehiculoId = v.id
      WHERE a.clienteId = ?
      ORDER BY a.fechaInicio DESC
    `;

    const [rows] = await pool.query(query, [userId]);
    res.json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};