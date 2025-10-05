import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generarTokenYEstablecerCookie } from "../utils/generarTokenYEstablecerCookie.js";
import {
	enviarCorreoRestablecimientoContraseña,
	enviarCorreoContraseñaRestablecida,
	enviarCorreoVerificacion,
	enviarCorreoBienvenida,
} from "../mailtrap/emails.js";
import { Usuario } from "../models/usuarioModel.js";

export const registrar = async (req, res) => {
	const { email, password, nombre, rol } = req.body;

	try {
		if (!email || !password || !nombre) {
			return res.status(400).json({ success: false, message: "Complete todos los campos" });
		}

		const usuarioYaExiste = await Usuario.buscarPorEmail(email);
		console.log("Verificando si usuario existe:", usuarioYaExiste);

		if (usuarioYaExiste) {
			return res.status(400).json({ success: false, message: "El usuario ya existe" });
		}

		const contraseñaHasheada = await bcryptjs.hash(password, 10);
		
		// Generar token de verificación de email (6 dígitos)
		const tokenVerificacion = Math.floor(100000 + Math.random() * 900000).toString();
		const tokenVerificacionExpira = new Date(Date.now() + 24 * 60 * 60 * 1000); 

		// Crear usuario con la nueva estructura
		const nuevoUsuario = await Usuario.crear({
            email,
            password_hash: contraseñaHasheada,
            nombre,
            rol: rol || 'cliente',
            verificationToken: tokenVerificacion, 
            verificationTokenExpiresAt: tokenVerificacionExpira,  
        });

		const token = generarTokenYEstablecerCookie(res, nuevoUsuario.id);

		// Enviar email de verificación al usuario
		await enviarCorreoVerificacion(nuevoUsuario.email, tokenVerificacion);

		res.status(201).json({
			success: true,
			message: "Usuario creado correctamente",
			usuario: {
				id: nuevoUsuario.id,
				email: nuevoUsuario.email,
				nombre: nuevoUsuario.nombre,
				rol: nuevoUsuario.rol,
				estaVerificado: nuevoUsuario.estaVerificado,
				creadoEn: nuevoUsuario.creadoEn,
				actualizadoEn: nuevoUsuario.actualizadoEn
			},
			token: token,
		});
	} catch (error) {
		console.log("Error en registro:", error);
		if (error.message.includes('ER_DUP_ENTRY') || error.message.includes('El email ya está registrado')) {
			return res.status(400).json({ success: false, message: "El usuario ya existe" });
		}
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verificarEmail = async (req, res) => {
    const { code } = req.body; // Cambia 'codigo' por 'code'
    
    console.log('📧 Código recibido en backend:', code); // Debug
    
    try {
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                message: "Código de verificación es requerido" 
            });
        }

        const usuario = await Usuario.buscarPorTokenVerificacion(code);
        
        if (!usuario) {
            return res.status(400).json({ success: false, message: "Código inválido o ya expirado." });
        }

        if (usuario.verificationTokenExpiresAt < new Date()) {  
            return res.status(400).json({ success: false, message: "Código inválido o ya expirado." });
        }

        const usuarioActualizado = await Usuario.verificarUsuario(usuario.id);

        await enviarCorreoBienvenida(usuarioActualizado.email, usuarioActualizado.nombre);

        res.status(200).json({
            success: true,
            message: "Email verificado correctamente",
            usuario: {
                id: usuarioActualizado.id,
                email: usuarioActualizado.email,
                nombre: usuarioActualizado.nombre,
                rol: usuarioActualizado.rol,
                isVerified: usuarioActualizado.isVerified, // Cambia estaVerificado por isVerified
                createdAt: usuarioActualizado.createdAt, // Cambia creadoEn por createdAt
                updatedAt: usuarioActualizado.updatedAt // Cambia actualizadoEn por updatedAt
            },
        });
    } catch (error) {
        console.log("Error en la verificación del email:", error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
};

export const iniciarSesion = async (req, res) => {
	const { email, password } = req.body;
	try {
		const usuario = await Usuario.buscarPorEmail(email);
		if (!usuario) {
			return res.status(400).json({ success: false, message: "Credenciales inválidas" });
		}
		
		const esContraseñaValida = await bcryptjs.compare(password, usuario.password_hash);
		if (!esContraseñaValida) {
			return res.status(400).json({ success: false, message: "Credenciales inválidas" });
		}

		const token = generarTokenYEstablecerCookie(res, usuario.id);

		await Usuario.actualizarUltimoInicioSesion(usuario.id);

		const usuarioActualizado = await Usuario.buscarPorId(usuario.id);

		res.status(200).json({
			success: true,
			message: "Conectado correctamente",
			usuario: {
				id: usuarioActualizado.id,
				email: usuarioActualizado.email,
				nombre: usuarioActualizado.nombre,
				rol: usuarioActualizado.rol,
				estaVerificado: usuarioActualizado.estaVerificado,
				ultimoInicioSesion: usuarioActualizado.ultimoInicioSesion,
				creadoEn: usuarioActualizado.creadoEn,
				actualizadoEn: usuarioActualizado.actualizadoEn
			},
			token: token,
		});
	} catch (error) {
		console.log("Error al iniciar sesión:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const cerrarSesion = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
};

export const olvideContraseña = async (req, res) => {
	const { email } = req.body;
	try {
		const usuario = await Usuario.buscarPorEmail(email);

		if (!usuario) {
			return res.status(200).json({ 
				success: true, 
				message: "Si el email existe, se enviarán instrucciones para restablecer la contraseña" 
			});
		}

		const tokenRestablecimiento = crypto.randomBytes(20).toString("hex");
		const tokenRestablecimientoExpira = new Date(Date.now() + 1 * 60 * 60 * 1000);

		await Usuario.establecerTokenRestablecimiento(usuario.id, tokenRestablecimiento, tokenRestablecimientoExpira);

		await enviarCorreoRestablecimientoContraseña(usuario.email, `${process.env.CLIENT_URL}/restablecer-contraseña/${tokenRestablecimiento}`);

		res.status(200).json({ 
			success: true, 
			message: "Si el email existe, se enviarán instrucciones para restablecer la contraseña" 
		});
	} catch (error) {
		console.log("Error en olvideContraseña:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const restablecerContraseña = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const usuario = await Usuario.buscarPorTokenRestablecimiento(token);

		if (!usuario) {
			return res.status(400).json({ success: false, message: "Token inválido o expirado" });
		}

		const contraseñaHasheada = await bcryptjs.hash(password, 10);

		await Usuario.actualizarContraseña(usuario.id, contraseñaHasheada);

		await enviarCorreoContraseñaRestablecida(usuario.email);

		res.status(200).json({ success: true, message: "Contraseña restablecida exitosamente" });
	} catch (error) {
		console.log("Error en restablecerContraseña:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verificarAutenticacion = async (req, res) => {
	try {
		const usuario = await Usuario.buscarPorId(req.usuarioId);
		
		if (!usuario) {
			return res.status(400).json({ success: false, message: "Usuario no encontrado" });
		}

		const usuarioSinContraseña = {
			id: usuario.id,
			email: usuario.email,
			nombre: usuario.nombre,
			rol: usuario.rol,
			estaVerificado: usuario.estaVerificado,
			ultimoInicioSesion: usuario.ultimoInicioSesion,
			creadoEn: usuario.creadoEn,
			actualizadoEn: usuario.actualizadoEn
		};

		res.status(200).json({ success: true, usuario: usuarioSinContraseña });
	} catch (error) {
		console.log("Error en verificarAutenticacion:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const obtenerPerfil = async (req, res) => {
	try {
		const usuario = await Usuario.buscarPorId(req.usuarioId);
		
		if (!usuario) {
			return res.status(404).json({ success: false, message: "Usuario no encontrado" });
		}

		res.status(200).json({
			success: true,
			usuario: {
				id: usuario.id,
				email: usuario.email,
				nombre: usuario.nombre,
				rol: usuario.rol,
				estaVerificado: usuario.estaVerificado,
				ultimoInicioSesion: usuario.ultimoInicioSesion,
				creadoEn: usuario.creadoEn,
				actualizadoEn: usuario.actualizadoEn
			}
		});
	} catch (error) {
		console.log("Error en obtenerPerfil:", error);
		res.status(500).json({ success: false, message: "Error del servidor" });
	}
};

export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        const usuarios = await Usuario.obtenerTodos(parseInt(limite), parseInt(pagina));

        res.status(200).json({
            success: true,
            usuarios,
            paginacion: {
                limite: parseInt(limite),
                pagina: parseInt(pagina)
            }
        });
    } catch (error) {
        console.log("Error al obtener usuarios:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};