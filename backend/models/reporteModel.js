import { pool } from "../db/connectDB.js";

export class Reporte {
    constructor(reporte) {
        this.id = reporte.id;
        this.plantId = reporte.plantId;
        this.generadoPor = reporte.generadoPor;
        this.fecha = reporte.fecha;
        this.rutaArchivo = reporte.rutaArchivo;
        this.usuario = reporte.usuario; // Para joins
        this.planta = reporte.planta; // Para joins
    }

    // Crear nuevo reporte
    static async crear(datosReporte) {
        try {
            const [resultado] = await pool.execute(
                `INSERT INTO reportes (plantId, generadoPor, fecha, rutaArchivo) 
                 VALUES (?, ?, ?, ?)`,
                [
                    datosReporte.plantId,
                    datosReporte.generadoPor,
                    datosReporte.fecha || new Date(),
                    datosReporte.rutaArchivo
                ]
            );

            return await this.buscarPorId(resultado.insertId);
        } catch (error) {
            throw new Error(`Error al crear reporte: ${error.message}`);
        }
    }

    // Buscar reporte por ID
    static async buscarPorId(id) {
        try {
            const [reportes] = await pool.execute(
                `SELECT r.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM reportes r 
                 LEFT JOIN users u ON r.generadoPor = u.id 
                 LEFT JOIN plants p ON r.plantId = p.id 
                 WHERE r.id = ?`,
                [id]
            );

            if (reportes.length === 0) {
                return null;
            }

            return new Reporte(reportes[0]);
        } catch (error) {
            throw new Error(`Error al buscar reporte por ID: ${error.message}`);
        }
    }

    // Obtener todos los reportes
    static async obtenerTodos(limite = 10, pagina = 1) {
        try {
            const offset = (pagina - 1) * limite;
            
            const [reportes] = await pool.execute(
                `SELECT r.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM reportes r 
                 LEFT JOIN users u ON r.generadoPor = u.id 
                 LEFT JOIN plants p ON r.plantId = p.id 
                 ORDER BY r.fecha DESC 
                 LIMIT ? OFFSET ?`,
                [limite, offset]
            );

            return reportes.map(reporte => new Reporte(reporte));
        } catch (error) {
            throw new Error(`Error al obtener reportes: ${error.message}`);
        }
    }

    // Obtener reportes por planta
    static async obtenerPorPlanta(plantId) {
        try {
            const [reportes] = await pool.execute(
                `SELECT r.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM reportes r 
                 LEFT JOIN users u ON r.generadoPor = u.id 
                 LEFT JOIN plants p ON r.plantId = p.id 
                 WHERE r.plantId = ? 
                 ORDER BY r.fecha DESC`,
                [plantId]
            );

            return reportes.map(reporte => new Reporte(reporte));
        } catch (error) {
            throw new Error(`Error al obtener reportes por planta: ${error.message}`);
        }
    }

    // Obtener reportes por usuario
    static async obtenerPorUsuario(usuarioId) {
        try {
            const [reportes] = await pool.execute(
                `SELECT r.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM reportes r 
                 LEFT JOIN users u ON r.generadoPor = u.id 
                 LEFT JOIN plants p ON r.plantId = p.id 
                 WHERE r.generadoPor = ? 
                 ORDER BY r.fecha DESC`,
                [usuarioId]
            );

            return reportes.map(reporte => new Reporte(reporte));
        } catch (error) {
            throw new Error(`Error al obtener reportes por usuario: ${error.message}`);
        }
    }

    // Eliminar reporte
    static async eliminar(id) {
        try {
            const [resultado] = await pool.execute(
                `DELETE FROM reportes WHERE id = ?`,
                [id]
            );

            return resultado.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar reporte: ${error.message}`);
        }
    }
}