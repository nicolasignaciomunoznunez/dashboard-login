import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStore = create((set, get) => ({
  // Estado
  metricas: null,
  ultimosDatos: [],
  plantasConDatos: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Obtener todas las métricas del dashboard
  obtenerMetricas: async () => {
    set({ loading: true, error: null });
    try {
      const [metricasResponse, datosResponse, plantasResponse] = await Promise.all([
        dashboardService.obtenerMetricas(),
        dashboardService.obtenerUltimosDatos(),
        dashboardService.obtenerPlantasConDatos()
      ]);

      set({
        metricas: metricasResponse,
        ultimosDatos: datosResponse.datos || [],
        plantasConDatos: plantasResponse.plantas || [],
        loading: false
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al cargar métricas', 
        loading: false 
      });
    }
  },

  // Obtener solo los últimos datos
  obtenerUltimosDatos: async () => {
    try {
      const response = await dashboardService.obtenerUltimosDatos();
      set({ ultimosDatos: response.datos || [] });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al cargar datos' });
      throw error;
    }
  }
}));