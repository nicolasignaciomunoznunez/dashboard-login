import { api } from './api';

export const plantasService = {
  // Obtener todas las plantas
  obtenerPlantas: async (limite = 10, pagina = 1) => {
    const response = await api.get(`/plantas?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener planta por ID
  obtenerPlanta: async (id) => {
    const response = await api.get(`/plantas/${id}`);
    return response.data;
  },

  // Crear nueva planta
  crearPlanta: async (plantaData) => {
    const response = await api.post('/plantas', plantaData);
    return response.data;
  },

  // Actualizar planta
  actualizarPlanta: async (id, plantaData) => {
    const response = await api.put(`/plantas/${id}`, plantaData);
    return response.data;
  },

  // Eliminar planta
  eliminarPlanta: async (id) => {
    const response = await api.delete(`/plantas/${id}`);
    return response.data;
  },

  // Obtener plantas por cliente
  obtenerPlantasCliente: async (clienteId) => {
    const response = await api.get(`/plantas/cliente/${clienteId}`);
    return response.data;
  },
};