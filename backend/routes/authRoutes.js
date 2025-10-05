import express from "express";
import {
    registrar,
    verificarEmail,
    iniciarSesion,
    cerrarSesion,
    olvideContraseña,
    restablecerContraseña,
    verificarAutenticacion,
    obtenerPerfil
} from "../controllers/authController.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// Rutas públicas
router.post("/registrar", registrar);
router.post("/verificar-email", verificarEmail);
router.post("/iniciar-sesion", iniciarSesion);
router.post("/olvide-contraseña", olvideContraseña);
router.post("/restablecer-contraseña/:token", restablecerContraseña);

// Rutas protegidas
router.get("/verificar-autenticacion", verificarToken, verificarAutenticacion);
router.get("/perfil", verificarToken, obtenerPerfil);
router.post("/cerrar-sesion", verificarToken, cerrarSesion);

export default router;