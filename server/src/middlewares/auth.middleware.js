import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  try {
    // 1. Obtener el token del header 
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No hay token, autorización denegada" });
    }

    // Separar la palabra "Bearer" del token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token con formato inválido" });
    }

    // 2. Verificar el token usando tu clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, userDecoded) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }

      // 3. ¡ÉXITO! Guardamos los datos del usuario en la peticion
      // Asi los siguientes controladores va a saber quien es el siguiente usuario
      req.user = userDecoded;

      next(); // Deja pasar al siguiente el controlador
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};