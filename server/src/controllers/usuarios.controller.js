import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../config/mailer.js";
import crypto from "crypto";

// Función auxiliar para crear tokens (Está perfecta)
const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const register = async (req, res) => {
  const { nombre, correo, contrasenia, departamento, municipio, telefono } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const [userFound] = await pool.query("SELECT * FROM Usuarios WHERE correo = ?", [correo]);
    if (userFound.length > 0) return res.status(400).json({ message: ["El correo ya está en uso"] });

    // 2. Hash password
    const passwordHash = await bcrypt.hash(contrasenia, 10);

    // 3. Generar token de verificación
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpirationDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos desde ahora
    // 4. Insertar usuario
    // En tu código original tenías "cliente" fijo, lo que ignoraba si alguien quería registrarse como propietario.
    const [result] = await pool.query(
      "INSERT INTO Usuarios (nombre, correo, contrasenia, rol, departamento, municipio, telefono, tokenVerificacion, verificado, tokenExpiracion ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        correo,
        passwordHash,
        "cliente",
        departamento,
        municipio,
        telefono,
        verificationToken,
        false,
        tokenExpirationDate
      ]
    );

    result

    // 5. Enviar correo
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: '"Rentados Soporte" <tu_correo@gmail.com>',
      to: correo,
      subject: "Verifica tu cuenta en Rentados",
      html: `
        <h1>¡Bienvenido/a ${nombre}!</h1>
        <p>Para activar tu cuenta y comenzar a usar todos nuestros servicios, 
        por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
        <a href="${verificationLink}">Verificar mi cuenta</a>
        <p>Si tú no creaste esta cuenta o recibiste este mensaje por error, 
        simplemente puedes ignorar este correo y no se realizará ningún cambio.</p>
        <p>Saludos cordiales,</p>
        <strong>Equipo de Rentados.</strong>
      `,
    });

    res.json({
      message: "Registro exitoso. Por favor revisa tu correo para verificar tu cuenta.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { correo, contrasenia } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM Usuarios WHERE correo = ?", [correo]);

    if (users.length === 0) {
      return res.status(400).json({ message: ["Usuario no encontrado"] });
    }

    const user = users[0];

    // Si no ponemos esto, el usuario podría loguearse sin haber verificado su email.
    if (!user.verificado) {
      return res.status(401).json({ message: ["Por favor verifica tu correo antes de iniciar sesión"] });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!isMatch) {
      return res.status(400).json({ message: ["Contraseña incorrecta"] });
    }

    // Crear Token
    const token = await createAccessToken({ id: user.id, rol: user.rol });

    res.json({
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      telefono: user.telefono,
      departamento: user.departamento,
      fechaCreacion: user.fechaCreacion,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  // el logout real sucede en el frontend borrando el token. 
  // Esta cookie solo sería útil si decidimos usar httpOnly cookies en el futuro.
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

//Ver usuarios registrados
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM Usuarios");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM Usuarios WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/* 
a pieza que falta (El Receptor)

Por eso necesitamos crear esa página VerifyEmailPage.jsx. Su única misión es actuar como mensajero:

    Arrancar cuando el usuario entra al link.

    Leer el token de la URL.

    Llamar a tu endpoint /api/verify-email entregándole el token.
*/
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM Usuarios WHERE tokenVerificacion = ?", [token]);

    if (users.length === 0) {
      return res.status(400).json({ message: ["Token inválido"] });
    }

    const user = users[0];

    const ahora = new Date();
    const expiracion = new Date(user.tokenExpiracion);

    if (ahora > expiracion) {
      return res.status(400).json({ message: ["El token ha expirado. Solicita uno nuevo."] });
    }

    await pool.query("UPDATE Usuarios SET verificado = 1, tokenVerificacion = NULL, tokenExpiracion = NULL WHERE id = ?", [user.id]);

    res.json({ message: "Correo verificado exitosamente." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// aun en desarrollo

/*
// Endpoint extra para validar perfil (útil para cuando recargas la página en React)
export const profile = async (req, res) => {
  // Este endpoint requerirá un middleware para verificar el token antes de llegar aquí
  // Por ahora lo dejamos simple
  const [rows] = await pool.query("SELECT * FROM Usuarios WHERE id = ?", [req.user.id]);
  if(!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });
  
  return res.json({
      id: rows[0].id,
      nombre: rows[0].nombre,
      correo: rows[0].correo,
      rol: rows[0].rol
  });
} */