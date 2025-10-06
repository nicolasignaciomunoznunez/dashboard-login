// components/reportes/TarjetaReporte.jsx
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function TarjetaReporte({ reporte, plantas, onDescargarReporte }) {
  const { user } = useAuthStore();
  const [descargando, setDescargando] = useState(false);

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
    return `reporte_${reporte.plantId}_${reporte.fecha}.pdf`;
  };

  const handleDescargar = async () => {
    if (!onDescargarReporte || !reporte.rutaArchivo) return;
    
    setDescargando(true);
    try {
      await onDescargarReporte(reporte.rutaArchivo);
    } catch (error) {
      console.error('Error al descargar:', error);
    } finally {
      setDescargando(false);
    }
  };

  const puedeEliminar = user?.rol === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Reporte
            </span>
            <span className="text-sm text-gray-500">
              #{reporte.id}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Reporte de {obtenerNombrePlanta()}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Generado:</span> {formatearFecha(reporte.fecha)}
            </div>
            <div>
              <span className="font-medium">Archivo:</span> {obtenerNombreArchivo()}
            </div>
            {reporte.generadoPorNombre && (
              <div>
                <span className="font-medium">Generado por:</span> {reporte.generadoPorNombre}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDescargar}
            disabled={descargando || !reporte.rutaArchivo}
            className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {descargando ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Descargando...</span>
              </>
            ) : (
              <>
                <span>⬇️</span>
                <span>Descargar</span>
              </>
            )}
          </button>
          
          {puedeEliminar && (
            <button
              onClick={() => {/* Agregar función de eliminar */}}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Eliminar reporte"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Información adicional del reporte */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Tipo:</span> {reporte.tipo || 'Reporte general'}
          {reporte.descripcion && (
            <>
              <span className="mx-2">•</span>
              <span>{reporte.descripcion}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}