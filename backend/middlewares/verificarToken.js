import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuarioModel.js";

export const verificarToken = async (req, res, next) => {
  let token;
  
  // 1. Primero buscar en los headers (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token encontrado en Authorization header');
  }
  // 2. Si no está en headers, buscar en cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token encontrado en cookies');
  }
  
  // 3. Si no hay token en ningún lugar, error
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "No estás autorizado para ver este contenido" 
    });
  }
  
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decodificado) {
      return res.status(401).json({ 
        success: false, 
        message: "Token inválido" 
      });
    }

    // ✅ VERIFICACIÓN ADICIONAL PARA MySQL: 
    // Confirmar que el usuario aún existe en la base de datos
    const usuario = await Usuario.buscarPorId(decodificado.usuarioId);
    
    if (!usuario) {
      return res.status(401).json({ 
        success: false, 
        message: "Usuario no encontrado. Token inválido." 
      });
    }

    // ✅ Verificar si el usuario está activo/verificado si lo deseas
    if (!usuario.isVerified) {
      return res.status(401).json({ 
        success: false, 
        message: "Cuenta no verificada. Por favor verifica tu email." 
      });
    }

    req.usuarioId = decodificado.usuarioId;
    req.usuario = usuario; // ✅ Opcional: agregar el usuario completo a la request
    console.log('✅ Token válido para usuario:', decodificado.usuarioId);
    next();
  } catch (error) {
    console.log("Error en verificarToken:", error);
    
    // Mejor manejo de errores específicos
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expirado" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token inválido" 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
};

// Versión alternativa más simple (sin verificación de email)
export const verificarTokenBasico = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Token no proporcionado."
      });
    }

    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.usuarioId;
    
    next();
  } catch (error) {
    console.log("Error en verificación de token:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado. Por favor, inicie sesión nuevamente."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token inválido."
    });
  }
};

// Middleware para verificar rol específico
export const verificarRol = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      const usuario = await Usuario.buscarPorId(req.usuarioId);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado."
        });
      }

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para realizar esta acción."
        });
      }

      next();
    } catch (error) {
      console.log("Error en verificación de rol:", error);
      res.status(500).json({
        success: false,
        message: "Error del servidor en verificación de permisos."
      });
    }
  };
};

// Middleware combinado: token + rol
export const autenticarYAutorizar = (rolesPermitidos = []) => {
  return [
    verificarToken,
    verificarRol(rolesPermitidos)
  ];
};