import { api } from './api';

export const dashboardService = {
  // Obtener métricas principales
  obtenerMetricas: async () => {
    const response = await api.get('/dashboard/metricas');
    return response.data;
  },

  // Obtener últimos datos de todas las plantas
  obtenerUltimosDatos: async () => {
    const response = await api.get('/datos-planta/ultimos');
    return response.data;
  },

  // Obtener estadísticas de incidencias
  obtenerEstadisticasIncidencias: async () => {
    const response = await api.get('/incidencias/estadisticas');
    return response.data;
  },

  // Obtener plantas con sus últimos datos
  obtenerPlantasConDatos: async () => {
    const response = await api.get('/plantas?limite=50');
    return response.data;
  }
};