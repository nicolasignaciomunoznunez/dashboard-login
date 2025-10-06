import { create } from 'zustand';
import { plantasService } from '../services/plantasService';

export const usePlantasStore = create((set, get) => ({
  // Estado
  plantas: [],
  plantaSeleccionada: null,
  loading: false,
  error: null,
  plantasCargadas: false, // ✅ VOLVER A AGREGAR

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todas las plantas - CON PROTECCIÓN COMPLETA
  obtenerPlantas: async (limite = 50, pagina = 1) => {
    const state = get();
    
    // ✅ PROTECCIÓN COMPLETA
    if (state.loading || state.plantasCargadas) {
      console.log('🛑 Plantas ya cargadas o cargando, evitando duplicado');
      return state.plantas;
    }

    console.log('🔄 Store: INICIANDO obtenerPlantas');
    
    set({ loading: true, error: null });
    
    try {
        const response = await plantasService.obtenerPlantas(limite, pagina);
        console.log('✅ Store: Plantas obtenidas:', response.plantas?.length);
        
        set({ 
          plantas: response.plantas, 
          loading: false,
          plantasCargadas: true // ✅ MARCAR COMO CARGADAS
        });
        
        return response;
    } catch (error) {
        console.error('❌ Store: Error obteniendo plantas:', error);
        set({ 
          error: error.response?.data?.message || 'Error al obtener plantas', 
          loading: false 
        });
        throw error;
    }
  },

  // ✅ FUNCIÓN PARA RESETEAR (usar cuando se cierran modales)
  resetearPlantasCargadas: () => set({ plantasCargadas: false }),
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
      const nuevaPlanta = response.planta;
      set(state => ({
        plantas: [...state.plantas, nuevaPlanta],
        loading: false
      }));
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
      set(state => ({
        plantas: state.plantas.map(planta => 
          planta.id === id ? response.planta : planta
        ),
        plantaSeleccionada: state.plantaSeleccionada?.id === id ? response.planta : state.plantaSeleccionada,
        loading: false
      }));
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
      set(state => ({
        plantas: state.plantas.filter(planta => planta.id !== id),
        plantaSeleccionada: state.plantaSeleccionada?.id === id ? null : state.plantaSeleccionada,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar planta', loading: false });
      throw error;
    }
  },

  // Limpiar planta seleccionada
  limpiarPlantaSeleccionada: () => set({ plantaSeleccionada: null }),
}));