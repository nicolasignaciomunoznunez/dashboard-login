// services/reportesService.js
import { api } from './api';

export const reportesService = {
  // Obtener todos los reportes
  obtenerReportes: async (limite = 50, pagina = 1) => {
    const response = await api.get(`/reportes?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener reporte por ID
  obtenerReporte: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data;
  },

  // Crear reporte
  crearReporte: async (reporteData) => {
    const response = await api.post('/reportes', reporteData);
    return response.data;
  },

  // Eliminar reporte
  eliminarReporte: async (id) => {
    const response = await api.delete(`/reportes/${id}`);
    return response.data;
  },

  // Obtener reportes por planta
  obtenerReportesPlanta: async (plantId) => {
    const response = await api.get(`/reportes/planta/${plantId}`);
    return response.data;
  },

  // Descargar reporte
descargarReporte: async (reporteId) => {
    const response = await api.get(`/reportes/descargar/${reporteId}`, {
        responseType: 'blob'
    });
    return response.data;
}
};