import { pool } from "../config/db.js";

export const getCars = async (req, res) => {
  try {
    const { marca, modelo, anio, departamento } = req.query;

    // Se agrega 'u.nombre' y 'u.departamento' al SELECT para que el FE reciba la info
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


// Obtener solo los carros del usuario logueado (Panel de Control)
export const getMyCars = async (req, res) => {
  try {
    const propietarioId = req.user.id; // Viene del middleware authRequired

    // El dueño necesita ver todo su inventario, siendo visible o no al publico
    const [rows] = await pool.query(
      "SELECT * FROM Vehiculos WHERE propietarioId = ? ORDER BY fechaCreacion DESC",
      [propietarioId]
    );

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Funcion para alternar la disponibilidad (solo el propietario puede hacerlo)
export const toggleCarAvailability = async (req, res) => {
  const { id } = req.params;
  const propietarioId = req.user.id;

  try {
    // Valida que el carro pertenezca al usuario
    const [cars] = await pool.query(
      "SELECT activo FROM Vehiculos WHERE id = ? AND propietarioId = ?",
      [id, propietarioId]
    );

    if (cars.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado o no autorizado" });
    }

    //Invierte el estado actual
    const nuevoEstado = !cars[0].activo;

    await pool.query("UPDATE Vehiculos SET activo = ? WHERE id = ?", [nuevoEstado, id]);

    res.json({
      message: `Vehículo ${nuevoEstado ? 'habilitado' : 'deshabilitado'} correctamente`,
      activo: nuevoEstado
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




// Obtiene carros en el mismo dptamento que el usuario logueado
export const getCarsNearMe = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del token

    // Asegura uso de la info mas reciente, no del token.
    const [users] = await pool.query(
      "SELECT departamento FROM Usuarios WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const userLocation = users[0].departamento;

    // Validacion:si el usuario no completo su perfil y no tiene departamento
    if (!userLocation) {
      return res.status(400).json({
        message: "No tienes una ubicación registrada. Por favor actualiza tu perfil."
      });
    }

    // Busca carros activos en esa misma ubi
    // Hacemos JOIN para mostrar tambien el nombre del dueño
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