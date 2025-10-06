// stores/checklistStore.js
import { create } from 'zustand';
import { mantenimientoService } from '../services/mantenimientoService';

export const useChecklistStore = create((set, get) => ({
  // Estado
  checklist: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener checklist de mantenimiento
  obtenerChecklist: async (mantenimientoId) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.obtenerChecklistMantenimiento(mantenimientoId);
      set({ checklist: response.checklist, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener checklist', loading: false });
      throw error;
    }
  },

  // Crear item de checklist
  crearItemChecklist: async (mantenimientoId, itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.crearChecklist(mantenimientoId, itemData);
      const nuevoItem = response.item;
      set(state => ({
        checklist: [...state.checklist, nuevoItem],
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear item', loading: false });
      throw error;
    }
  },

  // Actualizar item de checklist
  actualizarItemChecklist: async (mantenimientoId, checklistId, itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarItemChecklist(mantenimientoId, checklistId, itemData);
      set(state => ({
        checklist: state.checklist.map(item => 
          item.id === checklistId ? { ...item, ...itemData } : item
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar item', loading: false });
      throw error;
    }
  },

  // Eliminar item de checklist
  eliminarItemChecklist: async (mantenimientoId, checklistId) => {
    set({ loading: true, error: null });
    try {
      await mantenimientoService.eliminarChecklist(mantenimientoId, checklistId);
      set(state => ({
        checklist: state.checklist.filter(item => item.id !== checklistId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar item', loading: false });
      throw error;
    }
  },

  // Toggle completado de item
  toggleCompletadoItem: async (mantenimientoId, checklistId, completado) => {
    set({ loading: true, error: null });
    try {
      const response = await mantenimientoService.actualizarItemChecklist(mantenimientoId, checklistId, { completado });
      set(state => ({
        checklist: state.checklist.map(item => 
          item.id === checklistId ? { ...item, completado } : item
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar item', loading: false });
      throw error;
    }
  },

  // Limpiar checklist
  limpiarChecklist: () => set({ checklist: [], error: null }),
}));