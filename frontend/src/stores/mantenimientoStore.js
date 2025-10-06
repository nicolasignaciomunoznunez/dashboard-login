// stores/mantenimientoStore.js
import { create } from 'zustand';
import { mantenimientoService } from '../services/mantenimientoService';

export const useMantenimientoStore = create((set, get) => ({
  // Estado
  mantenimientos: [],
  mantenimientoSeleccionado: null,
  loading: false,
  error: null,
  mantenimientosCargados: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todos los mantenimientos
  obtenerMantenimientos: async (limite = 50, pagina = 1) => {
    const state = get();
    if (state.loading || state.mantenimientosCargados) {
      return state.mantenimientos;
    }

    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimientos(limite, pagina);
      set({ 
        mantenimientos: response.mantenimientos, 
        loading: false,
        mantenimientosCargados: true
      });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimientos', loading: false });
      throw error;
    }
  },

  // Obtener mantenimiento por ID
  obtenerMantenimiento: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimiento(id);
      set({ mantenimientoSeleccionado: response.mantenimiento, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimiento', loading: false });
      throw error;
    }
  },

  // Crear mantenimiento
  crearMantenimiento: async (mantenimientoData) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.crearMantenimiento(mantenimientoData);
      const nuevoMantenimiento = response.mantenimiento;
      set(state => ({
        mantenimientos: [nuevoMantenimiento, ...state.mantenimientos],
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear mantenimiento', loading: false });
      throw error;
    }
  },

  // Actualizar mantenimiento
  actualizarMantenimiento: async (id, mantenimientoData) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarMantenimiento(id, mantenimientoData);
      set(state => ({
        mantenimientos: state.mantenimientos.map(mant => 
          mant.id === id ? response.mantenimiento : mant
        ),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? response.mantenimiento : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar mantenimiento', loading: false });
      throw error;
    }
  },

  // Cambiar estado de mantenimiento
  cambiarEstadoMantenimiento: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarMantenimiento(id, { estado });
      set(state => ({
        mantenimientos: state.mantenimientos.map(mant => 
          mant.id === id ? { ...mant, estado } : mant
        ),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? 
          { ...state.mantenimientoSeleccionado, estado } : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado', loading: false });
      throw error;
    }
  },

  // Eliminar mantenimiento
  eliminarMantenimiento: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.eliminarMantenimiento(id);
      set(state => ({
        mantenimientos: state.mantenimientos.filter(mant => mant.id !== id),
        mantenimientoSeleccionado: state.mantenimientoSeleccionado?.id === id ? null : state.mantenimientoSeleccionado,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar mantenimiento', loading: false });
      throw error;
    }
  },

  // Obtener mantenimientos por planta
  obtenerMantenimientosPlanta: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerMantenimientosPlanta(plantId);
      set({ mantenimientos: response.mantenimientos, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener mantenimientos de planta', loading: false });
      throw error;
    }
  },

  // Resetear estado
  resetearMantenimientosCargados: () => set({ mantenimientosCargados: false }),
  limpiarMantenimientoSeleccionado: () => set({ mantenimientoSeleccionado: null }),
}));