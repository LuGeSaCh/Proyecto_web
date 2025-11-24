import { pool } from "../config/db.js";

// 1. REGISTRAR UN PAGO
export const createPayment = async (req, res) => {
  const { alquilerId, monto, metodoPago } = req.body;
  const userId = req.user.id; // ¡Obtenido del Mock!

  try {
    // VALIDACIÓN DE SEGURIDAD:
    // Verificar que el alquiler existe y que el usuario es el CLIENTE de ese alquiler.
    // (No queremos que pagues el alquiler de otro por error)
    const [alquiler] = await pool.query(
        "SELECT * FROM Alquileres WHERE id = ? AND clienteId = ?", 
        [alquilerId, userId]
    );

    if (alquiler.length === 0) {
        return res.status(403).json({ message: "No tienes permiso para pagar este alquiler o no existe." });
    }

    // Insertar el pago
    const [result] = await pool.query(
      "INSERT INTO Pagos (alquilerId, monto, metodoPago) VALUES (?, ?, ?)",
      [alquilerId, monto, metodoPago]
    );

    // Actualizar estado del alquiler a 'confirmado'
    await pool.query("UPDATE Alquileres SET estado = 'confirmado' WHERE id = ?", [alquilerId]);

    res.json({
      message: "Pago registrado exitosamente",
      paymentId: result.insertId,
      status: "pagado"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 2. Obtener todos los id de pagos de un usuario
// para poder listar sus facturas

// 3. OBTENER FACTURA 
export const getInvoice = async (req, res) => {
  const { id } = req.params; // ID del Pago (Factura)
  const userId = req.user.id; 

  try {
    const query = `
      SELECT 
        p.id as NumeroFactura,
        p.fechaPago,
        p.monto,
        p.metodoPago,
        a.fechaInicio,
        a.fechaFin,
        v.marca,
        v.modelo,
        v.anio,
        u.nombre as Cliente,
        u.correo as CorreoCliente,
        duenio.nombre as Propietario
      FROM Pagos p
      INNER JOIN Alquileres a ON p.alquilerId = a.id
      INNER JOIN Vehiculos v ON a.vehiculoId = v.id
      INNER JOIN Usuarios u ON a.clienteId = u.id
      INNER JOIN Usuarios duenio ON v.propietarioId = duenio.id
      WHERE p.id = ? 
      AND (u.id = ? OR duenio.id = ?) 
    `;

    const [rows] = await pool.query(query, [id, userId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada o acceso denegado." });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};