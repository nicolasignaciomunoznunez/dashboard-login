import { useEffect, useState } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { usePlantasStore } from '../stores/plantasStore';
import TarjetasMetricas from '../components/dashboard/TarjetasMetricas';
import ListaPlantasDashboard from '../components/dashboard/ListaPlantasDashboard';

export default function Dashboard() {
  const { metricas, loading: dashboardLoading, error, obtenerMetricas } = useDashboardStore();
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const [datosLocales] = useState([
    { plantaNombre: 'Planta Principal', nivelLocal: 85, turbidez: 2.1, cloro: 1.8, presion: 45.2 },
    { plantaNombre: 'Planta Norte', nivelLocal: 42, turbidez: 3.5, cloro: 2.1, presion: 38.7 },
    { plantaNombre: 'Planta Tratamiento Norte', nivelLocal: 68, turbidez: 1.8, cloro: 1.5, presion: 52.1 }
  ]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([
          obtenerMetricas(),
          obtenerPlantas()
        ]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    console.log('🔍 DEBUG DASHBOARD:');
console.log('- Plantas en estado:', plantas.length);
console.log('- Plantas array:', plantas);
console.log('- IDs de plantas:', plantas.map(p => p.id));

// Y en el return, agrega una sección de debug temporal:
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <h3 className="font-medium text-blue-800">Debug Info:</h3>
  <p className="text-sm text-blue-700">
    Plantas cargadas: {plantas.length}<br/>
    IDs: [{plantas.map(p => p.id).join(', ')}]
  </p>
</div>

    cargarDatos();
  }, [obtenerMetricas, obtenerPlantas]);

  const loading = dashboardLoading || plantasLoading;

  if (loading && (!metricas && plantas.length === 0)) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen del sistema</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <TarjetasMetricas 
        metricas={metricas} 
        plantas={plantas}
        datosLocales={datosLocales}
      />

      {/* Lista de Plantas */}
      <ListaPlantasDashboard plantas={plantas} />
    </div>
  );
}