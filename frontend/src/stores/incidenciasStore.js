import { create } from 'zustand';
import { incidenciasService } from '../services/incidenciasService';

export const useIncidenciasStore = create((set, get) => ({
  // Estado
  incidencias: [],
  incidenciaSeleccionada: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todas las incidencias
  obtenerIncidencias: async (limite = 10, pagina = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidencias(limite, pagina);
      set({ incidencias: response.incidencias, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencias', loading: false });
      throw error;
    }
  },

  // Obtener incidencia por ID
  obtenerIncidencia: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidencia(id);
      set({ incidenciaSeleccionada: response.incidencia, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencia', loading: false });
      throw error;
    }
  },

  // Crear incidencia
  crearIncidencia: async (incidenciaData) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.crearIncidencia(incidenciaData);
      // Actualizar lista
      await get().obtenerIncidencias();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear incidencia', loading: false });
      throw error;
    }
  },

  // Cambiar estado de incidencia
  cambiarEstadoIncidencia: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.cambiarEstadoIncidencia(id, estado);
      // Actualizar lista
      await get().obtenerIncidencias();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado', loading: false });
      throw error;
    }
  },

  // Obtener incidencias por planta
  obtenerIncidenciasPlanta: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.obtenerIncidenciasPlanta(plantId);
      set({ incidencias: response.incidencias, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener incidencias de planta', loading: false });
      throw error;
    }
  },

  // Limpiar incidencia seleccionada
  limpiarIncidenciaSeleccionada: () => set({ incidenciaSeleccionada: null }),
}));