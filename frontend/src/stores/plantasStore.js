import { create } from 'zustand';
import { plantasService } from '../services/plantasService';

export const usePlantasStore = create((set, get) => ({
  // Estado
  plantas: [],
  plantaSeleccionada: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

 // Obtener todas las plantas
obtenerPlantas: async (limite = 50, pagina = 1) => { // Cambia 10 por 50
    set({ loading: true, error: null });
    try {
        console.log('🔄 Obteniendo plantas...');
        const response = await plantasService.obtenerPlantas(limite, pagina);
        console.log('✅ Plantas obtenidas:', response.plantas?.length);
        set({ plantas: response.plantas, loading: false });
        return response;
    } catch (error) {
        console.error('❌ Error obteniendo plantas:', error);
        set({ error: error.response?.data?.message || 'Error al obtener plantas', loading: false });
        throw error;
    }
},

  // Obtener planta por ID
  obtenerPlanta: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await plantasService.obtenerPlanta(id);
      set({ plantaSeleccionada: response.planta, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener planta', loading: false });
      throw error;
    }
  },

  // Crear planta
  crearPlanta: async (plantaData) => {
    set({ loading: true, error: null });
    try {
      const response = await plantasService.crearPlanta(plantaData);
      // Actualizar lista de plantas
      await get().obtenerPlantas();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al crear planta', loading: false });
      throw error;
    }
  },

  // Actualizar planta
  actualizarPlanta: async (id, plantaData) => {
    set({ loading: true, error: null });
    try {
      const response = await plantasService.actualizarPlanta(id, plantaData);
      // Actualizar lista y planta seleccionada
      await get().obtenerPlantas();
      if (get().plantaSeleccionada?.id === id) {
        set({ plantaSeleccionada: response.planta });
      }
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al actualizar planta', loading: false });
      throw error;
    }
  },

  // Eliminar planta
  eliminarPlanta: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await plantasService.eliminarPlanta(id);
      // Actualizar lista
      await get().obtenerPlantas();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar planta', loading: false });
      throw error;
    }
  },

  // Limpiar planta seleccionada
  limpiarPlantaSeleccionada: () => set({ plantaSeleccionada: null }),
}));