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

  // Crear incidencia - CORREGIDO
  crearIncidencia: async (incidenciaData) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.crearIncidencia(incidenciaData);

      const nuevaIncidencia = response.incidencia;
      set(state => ({ 
        incidencias: [nuevaIncidencia, ...state.incidencias],
        loading: false 
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear incidencia', loading: false });
      throw error;
    }
  },

  // Cambiar estado de incidencia - CORREGIDO
  cambiarEstadoIncidencia: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.cambiarEstadoIncidencia(id, estado);
      // ✅ SOLUCIÓN: Actualizar localmente SIN nueva llamada API
      set(state => ({
        incidencias: state.incidencias.map(inc => 
          inc.id === id ? { ...inc, estado } : inc
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado', loading: false });
      throw error;
    }
  },
  
  // ✅ AGREGADO: Actualizar incidencia (título, descripción, etc.)
  actualizarIncidencia: async (id, datosActualizacion) => {
    set({ loading: true, error: null });
    try {
      const response = await incidenciasService.actualizarIncidencia(id, datosActualizacion);
      
      // Actualizar en el estado local
      set(state => ({
        incidencias: state.incidencias.map(inc => 
          inc.id === id ? { ...inc, ...datosActualizacion } : inc
        ),
        incidenciaSeleccionada: state.incidenciaSeleccionada?.id === id 
          ? { ...state.incidenciaSeleccionada, ...datosActualizacion }
          : state.incidenciaSeleccionada,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar incidencia', loading: false });
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