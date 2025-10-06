// components/reportes/ListaReportes.jsx
import TarjetaReporte from './TarjetaReporte';

export default function ListaReportes({ reportes, plantas, onDescargarReporte, loading }) {
  if (loading && reportes.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reportes.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes generados</h3>
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
        />
      ))}
    </div>
  );
}