import { Reporte } from "../models/reporteModel.js";

export const crearReporte = async (req, res) => {
    try {
        const { plantId, fecha, rutaArchivo } = req.body;
        const generadoPor = req.usuarioId;

        if (!plantId || !rutaArchivo) {
            return res.status(400).json({
                success: false,
                message: "plantId y rutaArchivo son requeridos"
            });
        }

        const nuevoReporte = await Reporte.crear({
            plantId,
            generadoPor,
            fecha,
            rutaArchivo
        });

        res.status(201).json({
            success: true,
            message: "Reporte creado correctamente",
            reporte: nuevoReporte
        });
    } catch (error) {
        console.log("Error al crear reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const reporte = await Reporte.buscarPorId(id);

        if (!reporte) {
            return res.status(404).json({
                success: false,
                message: "Reporte no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            reporte
        });
    } catch (error) {
        console.log("Error al obtener reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportes = async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        const reportes = await Reporte.obtenerTodos(parseInt(limite), parseInt(pagina));

        res.status(200).json({
            success: true,
            reportes,
            paginacion: {
                limite: parseInt(limite),
                pagina: parseInt(pagina)
            }
        });
    } catch (error) {
        console.log("Error al obtener reportes:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportesPlanta = async (req, res) => {
    try {
        const { plantId } = req.params;
        const reportes = await Reporte.obtenerPorPlanta(plantId);

        res.status(200).json({
            success: true,
            reportes
        });
    } catch (error) {
        console.log("Error al obtener reportes de planta:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportesUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const reportes = await Reporte.obtenerPorUsuario(usuarioId);

        res.status(200).json({
            success: true,
            reportes
        });
    } catch (error) {
        console.log("Error al obtener reportes del usuario:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const eliminarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Reporte.eliminar(id);

        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: "Reporte no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Reporte eliminado correctamente"
        });
    } catch (error) {
        console.log("Error al eliminar reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};