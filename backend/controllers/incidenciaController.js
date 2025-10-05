import { Incidencia } from "../models/incidenciaModel.js";

export const crearIncidencia = async (req, res) => {
    try {
        const { plantId, titulo, descripcion, estado } = req.body;
        const userId = req.usuarioId;

        if (!plantId || !titulo || !descripcion) {
            return res.status(400).json({
                success: false,
                message: "plantId, título y descripción son requeridos"
            });
        }

        const nuevaIncidencia = await Incidencia.crear({
            plantId,
            userId,
            titulo,
            descripcion,
            estado
        });

        res.status(201).json({
            success: true,
            message: "Incidencia reportada correctamente",
            incidencia: nuevaIncidencia
        });
    } catch (error) {
        console.log("Error al crear incidencia:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const incidencia = await Incidencia.buscarPorId(id);

        if (!incidencia) {
            return res.status(404).json({
                success: false,
                message: "Incidencia no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            incidencia
        });
    } catch (error) {
        console.log("Error al obtener incidencia:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerIncidencias = async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        const incidencias = await Incidencia.obtenerTodas(parseInt(limite), parseInt(pagina));

        res.status(200).json({
            success: true,
            incidencias,
            paginacion: {
                limite: parseInt(limite),
                pagina: parseInt(pagina)
            }
        });
    } catch (error) {
        console.log("Error al obtener incidencias:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerIncidenciasPlanta = async (req, res) => {
    try {
        const { plantId } = req.params;
        const incidencias = await Incidencia.obtenerPorPlanta(plantId);

        res.status(200).json({
            success: true,
            incidencias
        });
    } catch (error) {
        console.log("Error al obtener incidencias de planta:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerIncidenciasEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const incidencias = await Incidencia.obtenerPorEstado(estado);

        res.status(200).json({
            success: true,
            incidencias
        });
    } catch (error) {
        console.log("Error al obtener incidencias por estado:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const actualizarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const incidenciaActualizada = await Incidencia.actualizar(id, datosActualizados);

        res.status(200).json({
            success: true,
            message: "Incidencia actualizada correctamente",
            incidencia: incidenciaActualizada
        });
    } catch (error) {
        console.log("Error al actualizar incidencia:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cambiarEstadoIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: "Estado es requerido"
            });
        }

        const incidenciaActualizada = await Incidencia.cambiarEstado(id, estado);

        res.status(200).json({
            success: true,
            message: `Incidencia marcada como ${estado}`,
            incidencia: incidenciaActualizada
        });
    } catch (error) {
        console.log("Error al cambiar estado de incidencia:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const eliminarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Incidencia.eliminar(id);

        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: "Incidencia no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Incidencia eliminada correctamente"
        });
    } catch (error) {
        console.log("Error al eliminar incidencia:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};