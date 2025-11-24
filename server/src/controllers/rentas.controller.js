import { pool } from "../config/db.js";

// 1. Crear un nuevo alquiler
export const createRental = async (req, res) => {
  const { vehiculoId, fechaInicio, fechaFin } = req.body;
  const clienteId = req.user.id;

  try {
    // 1. Obtener datos del vehículo (necesitamos el precio)
    const [vehiculos] = await pool.query("SELECT * FROM Vehiculos WHERE id = ?", [vehiculoId]);
    
    if (vehiculos.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    const vehiculo = vehiculos[0];

    // 2. Validar fechas y calcular días
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    
    // Redondear hacia arriba para contar días completos
    const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

    if (dias <= 0) {
      return res.status(400).json({ message: "La fecha de fin debe ser posterior a la de inicio" });
    }

    // 3. Calcular precio total
    const precioTotal = dias * vehiculo.precioPorDia;

    // 4. Insertar el alquiler en estado 'pendiente'
    const [result] = await pool.query(
      "INSERT INTO Alquileres (vehiculoId, clienteId, fechaInicio, fechaFin, precioTotal, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [vehiculoId, clienteId, fechaInicio, fechaFin, precioTotal, "pendiente"]
    );

    res.json({
      message: "Solicitud de alquiler creada exitosamente",
      rentalId: result.insertId,
      vehiculo: vehiculo.marca + " " + vehiculo.modelo,
      dias,
      precioTotal,
      estado: "pendiente"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Obtener mis alquileres (Como cliente)
export const getMyRentals = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT 
        a.id, a.fechaInicio, a.fechaFin, a.precioTotal, a.estado,
        v.marca, v.modelo, v.imagenURL,
        u.nombre as propietario
      FROM Alquileres a
      INNER JOIN Vehiculos v ON a.vehiculoId = v.id
      INNER JOIN Usuarios u ON v.propietarioId = u.id
      WHERE a.clienteId = ?
      ORDER BY a.fechaInicio DESC
    `;

    const [rows] = await pool.query(query, [userId]);
    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};