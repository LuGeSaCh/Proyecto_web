import { pool } from "../config/db.js";

// Esta función actúa como si fuera el banco. No toca la base de datos.
const procesarPagoConBanco = async (datosTarjeta, monto) => {
  return new Promise((resolve, reject) => {
    console.log(`Procesando cobro de $${monto} con el banco simulado...`);
    
    // Simulamos un retraso de red de 2 segundos (para que se sienta real)
    setTimeout(() => {
      // Si el número de tarjeta no viene o termina en "0000", rechazamos el pago.
      if (!datosTarjeta || !datosTarjeta.numero || datosTarjeta.numero.endsWith("0000")) {
        reject(new Error("Fondos insuficientes o tarjeta rechazada por el banco."));
      } else {
        // Si todo está bien, aprobamos.
        resolve({ transaccionId: "TXN-" + Date.now(), estado: "aprobado" });
      }
    }, 2000);
  });
};

export const createPayment = async (req, res) => {
  // Recibimos 'datosTarjeta' del front para pasárselo al mock
  const { alquilerId, monto, metodoPago, datosTarjeta } = req.body;
  const userId = req.user.id; 

  try {
    // Verificar que el alquiler existe y pertenece al usuario que intenta pagar
    const [alquiler] = await pool.query(
        "SELECT * FROM Alquileres WHERE id = ? AND clienteId = ?", 
        [alquilerId, userId]
    );

    if (alquiler.length === 0) {
        return res.status(403).json({ message: "No tienes permiso para pagar este alquiler o no existe." });
    }
    // Si esto falla (reject), saltará directo al bloque 'catch' y no se guardará nada.
    await procesarPagoConBanco(datosTarjeta, monto);

    // registramos el pago en nuestra base de datos
    const [result] = await pool.query(
      "INSERT INTO Pagos (alquilerId, monto, metodoPago) VALUES (?, ?, ?)",
      [alquilerId, monto, metodoPago]
    );

    // Confirmamos la reserva porque ya tenemos el dinero
    await pool.query("UPDATE Alquileres SET estado = 'confirmado' WHERE id = ?", [alquilerId]);

    res.json({
      message: "Pago registrado exitosamente",
      paymentId: result.insertId,
      status: "pagado"
    });

  } catch (error) {
    console.error("Error en proceso de pago:", error.message);
    // Devolvemos el error al front para que muestre la alerta roja
    res.status(400).json({ message: error.message });
  }
};

// --- 3. OBTENER FACTURA (Tu función existente) ---
export const getInvoice = async (req, res) => {
  const { id } = req.params;
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