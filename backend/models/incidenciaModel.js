import { pool } from "../db/connectDB.js";

export class Incidencia {
    constructor(incidencia) {
        this.id = incidencia.id;
        this.plantId = incidencia.plantId;
        this.userId = incidencia.userId;
        this.titulo = incidencia.titulo;
        this.descripcion = incidencia.descripcion;
        this.estado = incidencia.estado;
        this.fechaReporte = incidencia.fechaReporte;
        this.fechaResolucion = incidencia.fechaResolucion;
        this.usuario = incidencia.usuario; // Para joins
        this.planta = incidencia.planta; // Para joins
    }

    // Crear nueva incidencia
    static async crear(datosIncidencia) {
        try {
            const [resultado] = await pool.execute(
                `INSERT INTO incidencias (plantId, userId, titulo, descripcion, estado) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    datosIncidencia.plantId,
                    datosIncidencia.userId,
                    datosIncidencia.titulo,
                    datosIncidencia.descripcion,
                    datosIncidencia.estado || 'pendiente'
                ]
            );

            return await this.buscarPorId(resultado.insertId);
        } catch (error) {
            throw new Error(`Error al crear incidencia: ${error.message}`);
        }
    }

    // Buscar incidencia por ID
    static async buscarPorId(id) {
        try {
            const [incidencias] = await pool.execute(
                `SELECT i.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM incidencias i 
                 LEFT JOIN users u ON i.userId = u.id 
                 LEFT JOIN plants p ON i.plantId = p.id 
                 WHERE i.id = ?`,
                [id]
            );

            if (incidencias.length === 0) {
                return null;
            }

            return new Incidencia(incidencias[0]);
        } catch (error) {
            throw new Error(`Error al buscar incidencia por ID: ${error.message}`);
        }
    }

    // Obtener todas las incidencias
    static async obtenerTodas(limite = 10, pagina = 1) {
        try {
            const offset = (pagina - 1) * limite;
            
            const [incidencias] = await pool.execute(
                `SELECT i.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM incidencias i 
                 LEFT JOIN users u ON i.userId = u.id 
                 LEFT JOIN plants p ON i.plantId = p.id 
                 ORDER BY i.fechaReporte DESC 
                 LIMIT ? OFFSET ?`,
                [limite, offset]
            );

            return incidencias.map(incidencia => new Incidencia(incidencia));
        } catch (error) {
            throw new Error(`Error al obtener incidencias: ${error.message}`);
        }
    }

    // Obtener incidencias por planta
    static async obtenerPorPlanta(plantId) {
        try {
            const [incidencias] = await pool.execute(
                `SELECT i.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM incidencias i 
                 LEFT JOIN users u ON i.userId = u.id 
                 LEFT JOIN plants p ON i.plantId = p.id 
                 WHERE i.plantId = ? 
                 ORDER BY i.fechaReporte DESC`,
                [plantId]
            );

            return incidencias.map(incidencia => new Incidencia(incidencia));
        } catch (error) {
            throw new Error(`Error al obtener incidencias por planta: ${error.message}`);
        }
    }

    // Obtener incidencias por estado
    static async obtenerPorEstado(estado) {
        try {
            const [incidencias] = await pool.execute(
                `SELECT i.*, u.nombre as usuarioNombre, p.nombre as plantaNombre 
                 FROM incidencias i 
                 LEFT JOIN users u ON i.userId = u.id 
                 LEFT JOIN plants p ON i.plantId = p.id 
                 WHERE i.estado = ? 
                 ORDER BY i.fechaReporte DESC`,
                [estado]
            );

            return incidencias.map(incidencia => new Incidencia(incidencia));
        } catch (error) {
            throw new Error(`Error al obtener incidencias por estado: ${error.message}`);
        }
    }

    // Actualizar incidencia
    static async actualizar(id, datosActualizados) {
        try {
            const camposPermitidos = ['titulo', 'descripcion', 'estado', 'fechaResolucion'];
            const camposParaActualizar = [];
            const valores = [];

            for (const campo of camposPermitidos) {
                if (datosActualizados[campo] !== undefined) {
                    camposParaActualizar.push(`${campo} = ?`);
                    valores.push(datosActualizados[campo]);
                }
            }

            if (camposParaActualizar.length === 0) {
                throw new Error('No hay campos válidos para actualizar');
            }

            valores.push(id);

            const consulta = `UPDATE incidencias SET ${camposParaActualizar.join(', ')} WHERE id = ?`;
            await pool.execute(consulta, valores);

            return await this.buscarPorId(id);
        } catch (error) {
            throw new Error(`Error al actualizar incidencia: ${error.message}`);
        }
    }

    // Cambiar estado de incidencia
    static async cambiarEstado(id, estado) {
        try {
            let fechaResolucion = null;
            if (estado === 'resuelto') {
                fechaResolucion = new Date();
            }

            await pool.execute(
                `UPDATE incidencias SET estado = ?, fechaResolucion = ? WHERE id = ?`,
                [estado, fechaResolucion, id]
            );

            return await this.buscarPorId(id);
        } catch (error) {
            throw new Error(`Error al cambiar estado de incidencia: ${error.message}`);
        }
    }

    // Eliminar incidencia
    static async eliminar(id) {
        try {
            const [resultado] = await pool.execute(
                `DELETE FROM incidencias WHERE id = ?`,
                [id]
            );

            return resultado.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar incidencia: ${error.message}`);
        }
    }
}