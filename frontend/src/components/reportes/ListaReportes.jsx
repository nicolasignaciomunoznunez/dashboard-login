// components/reportes/ListaReportes.jsx
import TarjetaReporte from './TarjetaReporte';

export default function ListaReportes({ reportes, plantas, onDescargarReporte, onEliminarReporte,loading }) {
  if (loading && reportes.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reportes.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-300 text-6xl mb-4">
          <i className="fas fa-chart-bar"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reportes generados</h3>
        <p className="text-gray-500">Genera el primer reporte para verlo aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportes.map((reporte) => (
        <TarjetaReporte
          key={reporte.id}
          reporte={reporte}
          plantas={plantas}
          onDescargarReporte={onDescargarReporte}
          onEliminarReporte={onEliminarReporte}
        />
      ))}
    </div>
  );
}