// stores/reportesStore.js
import { create } from 'zustand';
import { reportesService } from '../services/reportesService'; // ✅ Cambiar a reportesService

export const useReportesStore = create((set, get) => ({
  // Estado
  reportes: [],
  reporteSeleccionado: null,
  loading: false,
  error: null,
  reportesCargados: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),


// Obtener todos los reportes - VERSIÓN CORREGIDA
obtenerReportes: async (limite = 50, pagina = 1, forzarRecarga = false) => {
  const state = get();
  
  // ✅ SOLO evitar si ya está cargando, PERMITIR recarga forzada
  if (state.loading && !forzarRecarga) {
    return state.reportes;
  }

  set({ loading: true, error: null });
  try {
    console.log('🔄 Obteniendo reportes...', { limite, pagina, forzarRecarga });
    const response = await reportesService.obtenerReportes(limite, pagina);
    
    console.log('✅ Reportes obtenidos:', response);
    
    set({ 
      reportes: response.reportes || response, 
      loading: false,
      reportesCargados: true
    });
    return response;
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    set({ error: error.response?.data?.message || 'Error al obtener reportes', loading: false });
    throw error;
  }
},

  // Obtener reporte por ID
  obtenerReporte: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await reportesService.obtenerReporte(id); // ✅ Cambiar servicio
      set({ reporteSeleccionado: response.reporte, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener reporte', loading: false });
      throw error;
    }
  },

  // Crear reporte
  generarReporte: async (reporteData) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Generando reporte:', reporteData);
      const response = await reportesService.crearReporte(reporteData);
      const nuevoReporte = response.reporte;
      
      set(state => ({
        reportes: [nuevoReporte, ...state.reportes],
        loading: false
      }));
      
      console.log('✅ Reporte generado:', nuevoReporte);
      return response;
    } catch (error) {
      console.error('❌ Error al generar reporte:', error);
      set({ error: error.response?.data?.message || 'Error al generar reporte', loading: false });
      throw error;
    }
},

  // Eliminar reporte
  eliminarReporte: async (id) => {
    set({ loading: true, error: null });
    try {
      await reportesService.eliminarReporte(id); // ✅ Cambiar servicio
      set(state => ({
        reportes: state.reportes.filter(reporte => reporte.id !== id),
        reporteSeleccionado: state.reporteSeleccionado?.id === id ? null : state.reporteSeleccionado,
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al eliminar reporte', loading: false });
      throw error;
    }
  },

  // Obtener reportes por planta
  obtenerReportesPlanta: async (plantId) => {
    set({ loading: true, error: null });
    try {
      const response = await reportesService.obtenerReportesPlanta(plantId); // ✅ Cambiar servicio
      set({ reportes: response.reportes, loading: false });
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error al obtener reportes de planta', loading: false });
      throw error;
    }
  },

  // Descargar reporte
descargarReporte: async (reporteId, nombreArchivo = 'reporte.pdf') => {
    try {
        console.log('🔄 Descargando reporte ID:', reporteId);
        
        // ✅ Usar el ID del reporte
        const blob = await reportesService.descargarReporte(reporteId);
        
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Reporte descargado');
        return true;
    } catch (error) {
        console.error('❌ Error al descargar reporte:', error);
        throw error;
    }
},

  // Resetear estado
  resetearReportesCargados: () => set({ reportesCargados: false }),
  limpiarReporteSeleccionado: () => set({ reporteSeleccionado: null }),
}));