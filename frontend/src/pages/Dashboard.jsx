import { useEffect, useState } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useMantenimientoStore } from '../stores/mantenimientoStore';
import TarjetasMetricasAvanzadas from '../components/dashboard/TarjetasMetricasAvanzadas';
import ListaPlantasDashboard from '../components/dashboard/ListaPlantasDashboard';
import GraficosDashboard from '../components/dashboard/GraficosDashboard';
import AlertasDashboard from '../components/dashboard/AlertasDashboard';
import ResumenActividad from '../components/dashboard/ResumenActividad';

export default function Dashboard() {
  const { 
    metricas, 
    loading: dashboardLoading, 
    error, 
    obtenerMetricas 
  } = useDashboardStore();
  
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const { incidencias, obtenerIncidencias } = useIncidenciasStore();
  const { mantenimientos, obtenerMantenimientos } = useMantenimientoStore();
  
  const [periodo, setPeriodo] = useState('hoy');
  const [vista, setVista] = useState('resumen');

  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([
        obtenerMetricas(),
        obtenerPlantas(10),
        obtenerIncidencias(10),
        obtenerMantenimientos(10)
      ]);
    };
    cargarDatos();
  }, [obtenerMetricas, obtenerPlantas, obtenerIncidencias, obtenerMantenimientos]);

  const loading = dashboardLoading || plantasLoading;

  // Preparar datos para gráficos basados en datos reales
  const datosGraficos = {
    plantas: plantas.slice(0, 5).map(planta => ({
      id: planta.id,
      nombre: planta.nombre,
      nivel: Math.random() * 100, // Temporal - puedes reemplazar con datos reales luego
      estado: Math.random() > 0.3 ? 'optimal' : 'warning'
    })),
    incidencias: {
      pendientes: incidencias.filter(i => i.estado === 'pendiente').length,
      enProgreso: incidencias.filter(i => i.estado === 'en_progreso').length,
      resueltas: incidencias.filter(i => i.estado === 'resuelto').length
    },
    metricasReales: metricas?.metricas // Usar métricas reales del backend
  };

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
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">
            {metricas?.metricas ? `Sistema operando al ${metricas.metricas.eficienciaPromedio}% de eficiencia` : 'Cargando métricas...'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVista('resumen')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                vista === 'resumen' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setVista('plantas')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                vista === 'plantas' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plantas
            </button>
            <button
              onClick={() => setVista('alertas')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                vista === 'alertas' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Alertas
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tarjetas de Métricas Avanzadas con datos reales */}
      <TarjetasMetricasAvanzadas 
        metricas={metricas?.metricas}
        plantas={plantas}
        incidencias={incidencias}
        mantenimientos={mantenimientos}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna izquierda - Gráficos y Métricas */}
        <div className="xl:col-span-2 space-y-6">
          <GraficosDashboard 
            datos={datosGraficos}
            plantas={plantas}
            incidencias={incidencias}
            metricasReales={metricas?.metricas}
          />
          
          {/* Resumen de Actividad */}
          <ResumenActividad 
            incidencias={incidencias}
            mantenimientos={mantenimientos}
          />
        </div>

        {/* Columna derecha - Alertas y Plantas */}
        <div className="space-y-6">
          <AlertasDashboard 
            plantas={plantas}
            incidencias={incidencias}
            mantenimientos={mantenimientos}
          />
          
          <ListaPlantasDashboard plantas={plantas} />
        </div>
      </div>

      {/* Estado del Sistema con datos reales */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Estado del Sistema</h3>
            <p className="text-blue-700">
              {metricas?.metricas 
                ? `${metricas.metricas.plantasActivas}/${metricas.metricas.totalPlantas} plantas activas` 
                : 'Cargando estado del sistema...'
              }
            </p>
            {metricas?.metricas && (
              <p className="text-sm text-blue-600 mt-1">
                Eficiencia: {metricas.metricas.eficienciaPromedio}% • 
                Incidencias activas: {metricas.metricas.incidenciasActivas}
              </p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            metricas?.metricas && metricas.metricas.plantasActivas > 0
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {metricas?.metricas && metricas.metricas.plantasActivas > 0 ? '✅ Operativo' : '⚠️ En configuración'}
          </div>
        </div>
      </div>
    </div>
  );
}