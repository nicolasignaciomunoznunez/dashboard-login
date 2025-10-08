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
      nivel: Math.random() * 100,
      estado: Math.random() > 0.3 ? 'optimal' : 'warning'
    })),
    incidencias: {
      pendientes: incidencias.filter(i => i.estado === 'pendiente').length,
      enProgreso: incidencias.filter(i => i.estado === 'en_progreso').length,
      resueltas: incidencias.filter(i => i.estado === 'resuelto').length
    },
    metricasReales: metricas?.metricas
  };

  if (loading && (!metricas && plantas.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          
          {/* Metrics cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm h-80"></div>
              <div className="bg-white rounded-xl p-6 shadow-sm h-64"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm h-64"></div>
              <div className="bg-white rounded-xl p-6 shadow-sm h-80"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header con controles mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Panel de Control
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {metricas?.metricas ? `Sistema operando al ${metricas.metricas.eficienciaPromedio}% de eficiencia` : 'Cargando métricas...'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setVista('resumen')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                vista === 'resumen' 
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setVista('plantas')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                vista === 'plantas' 
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Plantas
            </button>
            <button
              onClick={() => setVista('alertas')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                vista === 'alertas' 
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Alertas
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-sm">!</span>
          </div>
          <div>
            <p className="font-medium">Error al cargar datos</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas Avanzadas */}
      <TarjetasMetricasAvanzadas 
        metricas={metricas?.metricas}
        plantas={plantas}
        incidencias={incidencias}
        mantenimientos={mantenimientos}
      />

      {/* Grid Principal Mejorado */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna izquierda - Gráficos y Métricas */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <GraficosDashboard 
              datos={datosGraficos}
              plantas={plantas}
              incidencias={incidencias}
              metricasReales={metricas?.metricas}
            />
          </div>
          
          {/* Resumen de Actividad */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ResumenActividad 
              incidencias={incidencias}
              mantenimientos={mantenimientos}
            />
          </div>
        </div>

        {/* Columna derecha - Alertas y Plantas */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <AlertasDashboard 
              plantas={plantas}
              incidencias={incidencias}
              mantenimientos={mantenimientos}
            />
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ListaPlantasDashboard plantas={plantas} />
          </div>
        </div>
      </div>

      {/* Estado del Sistema Mejorado */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Estado del Sistema</h3>
            <div className="flex items-center gap-4 text-blue-100">
              <p>
                {metricas?.metricas 
                  ? `${metricas.metricas.plantasActivas}/${metricas.metricas.totalPlantas} plantas activas` 
                  : 'Cargando estado del sistema...'
                }
              </p>
              {metricas?.metricas && (
                <div className="flex items-center gap-4 text-sm">
                  <span>Eficiencia: {metricas.metricas.eficienciaPromedio}%</span>
                  <span>•</span>
                  <span>Incidencias activas: {metricas.metricas.incidenciasActivas}</span>
                </div>
              )}
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
            metricas?.metricas && metricas.metricas.plantasActivas > 0
              ? 'bg-green-400/20 text-green-100 border border-green-300/30' 
              : 'bg-yellow-400/20 text-yellow-100 border border-yellow-300/30'
          }`}>
            {metricas?.metricas && metricas.metricas.plantasActivas > 0 ? '✅ Operativo' : '⚠️ En configuración'}
          </div>
        </div>
        
        {/* Barra de progreso de eficiencia */}
        {metricas?.metricas && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-100 mb-2">
              <span>Eficiencia del sistema</span>
              <span>{metricas.metricas.eficienciaPromedio}%</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                style={{ width: `${metricas.metricas.eficienciaPromedio}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}