import { api } from './api';

export const incidenciasService = {
  // Obtener todas las incidencias
  obtenerIncidencias: async (limite = 10, pagina = 1) => {
    const response = await api.get(`/incidencias?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener incidencia por ID
  obtenerIncidencia: async (id) => {
    const response = await api.get(`/incidencias/${id}`);
    return response.data;
  },

  // Crear nueva incidencia
  crearIncidencia: async (incidenciaData) => {
    const response = await api.post('/incidencias', incidenciaData);
    return response.data;
  },

  // Actualizar incidencia
  actualizarIncidencia: async (id, incidenciaData) => {
    const response = await api.put(`/incidencias/${id}`, incidenciaData);
    return response.data;
  },

  // Cambiar estado de incidencia
  cambiarEstadoIncidencia: async (id, estado) => {
    const response = await api.patch(`/incidencias/${id}/estado`, { estado });
    return response.data;
  },

  // Eliminar incidencia
  eliminarIncidencia: async (id) => {
    const response = await api.delete(`/incidencias/${id}`);
    return response.data;
  },

  // Obtener incidencias por planta
  obtenerIncidenciasPlanta: async (plantId) => {
    const response = await api.get(`/incidencias/planta/${plantId}`);
    return response.data;
  },

  // Obtener incidencias por estado
  obtenerIncidenciasEstado: async (estado) => {
    const response = await api.get(`/incidencias/estado/${estado}`);
    return response.data;
  }

  
  
};