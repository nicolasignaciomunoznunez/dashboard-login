// components/reportes/TarjetaReporte.jsx - COMPLETO Y CORREGIDO
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function TarjetaReporte({ reporte, plantas, onDescargarReporte, onEliminarReporte }) {
  const { user } = useAuthStore();
  const [descargando, setDescargando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Obtener nombre de la planta
  const obtenerNombrePlanta = () => {
    if (reporte.plantaNombre) {
      return reporte.plantaNombre;
    }
    
    const planta = plantas.find(p => p.id === reporte.plantId);
    return planta ? planta.nombre : `Planta ${reporte.plantId}`;
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerNombreArchivo = () => {
    if (reporte.rutaArchivo) {
        return reporte.rutaArchivo.split('/').pop() || 'reporte.pdf';
    }
    return `reporte_${reporte.tipo}_${reporte.plantId}_${reporte.fecha}.pdf`;
  };

  const handleDescargar = async () => {
    if (!onDescargarReporte || !reporte.id) return;
    
    setDescargando(true);
    try {
        await onDescargarReporte(reporte.id);
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('Error al descargar el reporte: ' + error.message);
    } finally {
        setDescargando(false);
    }
  };

  // ✅ FUNCIÓN PARA ELIMINAR REPORTE
  const handleEliminar = async () => {
    if (!onEliminarReporte || !reporte.id) return;
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return;
    }
    
    setEliminando(true);
    try {
        await onEliminarReporte(reporte.id);
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el reporte: ' + error.message);
    } finally {
        setEliminando(false);
    }
  };

  const puedeEliminar = user?.rol === 'admin';

  // Configuración de tipos de reporte
  const tiposReporte = {
    general: { label: 'General', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    mantenimiento: { label: 'Mantenimiento', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    incidencias: { label: 'Incidencias', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    rendimiento: { label: 'Rendimiento', color: 'text-green-600 bg-green-50 border-green-200' },
    calidad: { label: 'Calidad', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' }
  };

  const tipoConfig = tiposReporte[reporte.tipo] || tiposReporte.general;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-medium border ${tipoConfig.color}`}>
                {tipoConfig.label}
              </span>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              #{reporte.id}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Reporte de {obtenerNombrePlanta()}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatearFecha(reporte.fecha)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">{obtenerNombreArchivo()}</span>
            </div>
            {reporte.generadoPorNombre && (
              <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Generado por: {reporte.generadoPorNombre}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* BOTÓN DESCARGAR */}
          <button
            onClick={handleDescargar}
            disabled={descargando || !reporte.id}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {descargando ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Descargando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Descargar</span>
              </>
            )}
          </button>
          
          {/* ✅ BOTÓN ELIMINAR - CORREGIDO */}
          {puedeEliminar && (
            <button
              onClick={handleEliminar}
              disabled={eliminando}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Eliminar reporte"
            >
              {eliminando ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Información adicional del reporte */}
      {reporte.descripcion && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="leading-relaxed">{reporte.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}