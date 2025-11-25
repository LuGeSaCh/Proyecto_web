import { pool } from "../config/db.js";

export const getCars = async (req, res) => {
  try {
    const { marca, modelo, anio, departamento } = req.query;

    // Agregamos 'u.nombre' y 'u.departamento' al SELECT para que el frontend reciba esa info útil
    let query = `
      SELECT v.*, u.nombre as nombreDuenio, u.departamento 
      FROM Vehiculos v
      INNER JOIN Usuarios u ON v.propietarioId = u.id
      WHERE v.activo = 1
    `;
    
    const queryParams = [];

    
    if (marca) {
      query += " AND v.marca = ?";
      queryParams.push(marca);
    }

    if (modelo) {
      query += " AND v.modelo = ?";
      queryParams.push(modelo);
    }

    if (anio) {
      query += " AND v.anio = ?";
      queryParams.push(anio);
    }
    if (departamento) {
      query += " AND u.departamento = ?";
      queryParams.push(departamento);
    }

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCar = async (req, res) => {
  if (req.user.rol !== 'propietario' && req.user.rol !== 'admin') {
    return res.status(403).json({ message: "Acceso denegado. Solo los propietarios pueden publicar vehículos." });
  }

  const { tipoId, marca, modelo, anio, precioPorDia, imagenURL, descripcion } = req.body;
  const propietarioId = req.user.id; 

  try {
    const [result] = await pool.query(
      "INSERT INTO Vehiculos (propietarioId, tipoId, marca, modelo, anio, precioPorDia, imagenURL, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [propietarioId, tipoId, marca, modelo, anio, precioPorDia, imagenURL, descripcion]
    );

    res.json({
      id: result.insertId,
      marca,
      modelo,
      message: "Vehículo publicado exitosamente"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener carros en el mismo departamento que el usuario logueado
export const getCarsNearMe = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del token

    // 1. PASO ADICIONAL: Consultar la ubicación actual del usuario en la BD
    // Esto asegura que usamos la información más reciente, no la del token.
    const [users] = await pool.query(
      "SELECT departamento FROM Usuarios WHERE id = ?", 
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    
    const userLocation = users[0].departamento;

    // Validación: Si el usuario no completó su perfil y no tiene departamento
    if (!userLocation) {
      return res.status(400).json({ 
        message: "No tienes una ubicación registrada. Por favor actualiza tu perfil." 
      });
    }

    // 2. Buscamos carros activos en esa misma ubicación
    // Hacemos JOIN para mostrar también el nombre del dueño
    const query = `
      SELECT v.*, u.nombre as nombreDuenio, u.departamento, u.municipio
      FROM Vehiculos v
      INNER JOIN Usuarios u ON v.propietarioId = u.id
      WHERE u.departamento = ? AND v.activo = 1
    `;
    
    const [rows] = await pool.query(query, [userLocation]);
    
    res.json({
      ubicacionUsuario: userLocation,
      cantidad: rows.length,
      carros: rows
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};