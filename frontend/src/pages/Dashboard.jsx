import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../stores/dashboardStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useMantenimientoStore } from '../stores/mantenimientoStore';
import { useReportesStore } from '../stores/reportesStore';
import { useAuthStore } from '../stores/authStore';
import GraficosDashboard from '../components/dashboard/GraficosDashboard';
import ResumenActividad from '../components/dashboard/ResumenActividad';

export default function Dashboard() {
  // ✅ OBTENER USUARIO Y ROL
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const { 
    metricas,
    ultimosDatos, 
    loading: dashboardLoading, 
    error, 
    obtenerMetricas 
  } = useDashboardStore();
  
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const { incidencias, obtenerIncidencias } = useIncidenciasStore();
  const { mantenimientos, obtenerMantenimientos } = useMantenimientoStore();
  const { reportes, obtenerReportes } = useReportesStore();
  
  const [periodo, setPeriodo] = useState('hoy');
  const [cargandoSecciones, setCargandoSecciones] = useState({
    metricas: true,
    plantas: true,
    incidencias: false,
    mantenimientos: false,
    reportes: false
  });

  // ✅ DETERMINAR ROLES Y PERMISOS
  const esCliente = user?.rol === 'cliente';
  const esTecnico = user?.rol === 'tecnico';
  const esAdmin = user?.rol === 'admin';
  const puedeVerDashboard = esTecnico || esAdmin;

  // ✅ CALCULAR MÉTRICAS POR PLANTA (MEMOIZADO)
  const calcularMetricasPlanta = useCallback((plantaId) => {
    const incidenciasPlanta = incidencias.filter(i => i.plantId === plantaId);
    const mantenimientosPlanta = mantenimientos.filter(m => m.plantId === plantaId);
    const reportesPlanta = reportes?.filter(r => r.plantId === plantaId) || [];
      console.log(`🔍 DEBUG Reportes - Planta ${plantaId}:`, {
    todosLosReportes: reportes,
    reportesFiltrados: reportesPlanta,
    totalReportes: reportes?.length || 0,
    reportesDeEstaPlanta: reportesPlanta.length,
    detallesReportes: reportesPlanta.map(r => ({ id: r.id, plantId: r.plantId, titulo: r.titulo }))
  });
    const incidenciasResueltas = incidenciasPlanta.filter(i => i.estado === 'resuelto').length;
    const mantenimientosPreventivos = mantenimientosPlanta.filter(m => m.tipo === 'preventivo').length;
    const mantenimientosCompletados = mantenimientosPlanta.filter(m => m.estado === 'completado').length;
    
    const tasaResolucion = incidenciasPlanta.length > 0 
      ? Math.round((incidenciasResueltas / incidenciasPlanta.length) * 100)
      : 100;

    const totalMantenimientos = mantenimientosPlanta.length;
    const mantenimientosCorrectivos = totalMantenimientos - mantenimientosPreventivos;

    const ratioMantenimientoPreventivo = totalMantenimientos > 0
      ? Math.round((mantenimientosPreventivos / totalMantenimientos) * 100)
      : 0;

    const ratioMantenimientoCorrectivo = totalMantenimientos > 0
      ? Math.round((mantenimientosCorrectivos / totalMantenimientos) * 100)
      : 0;

    const tasaCumplimientoMantenimiento = mantenimientosPlanta.length > 0
      ? Math.round((mantenimientosCompletados / mantenimientosPlanta.length) * 100)
      : 100;

    // Calcular estado general
    const incidenciasPendientes = incidenciasPlanta.filter(i => i.estado !== 'resuelto').length;
    const mantenimientosAtrasados = mantenimientosPlanta.filter(m => 
      m.estado !== 'completado' && new Date(m.fechaProgramada) < new Date()
    ).length;

    let estadoGeneral = 'optimal';
    if (incidenciasPendientes > 0 || mantenimientosAtrasados > 0) estadoGeneral = 'attention';
    if (incidenciasPendientes > 2 || mantenimientosAtrasados > 1) estadoGeneral = 'critical';

    return {
        incidenciasActivas: incidenciasPendientes,
  totalIncidencias: incidenciasPlanta.length,
  incidenciasResueltas,
  tasaResolucion,
  mantenimientosPendientes: mantenimientosPlanta.filter(m => m.estado !== 'completado').length,
  totalMantenimientos: totalMantenimientos,
  mantenimientosPreventivos,
  mantenimientosCorrectivos, // ✅ NUEVO
  mantenimientosCompletados,
  ratioMantenimientoPreventivo,
  ratioMantenimientoCorrectivo, // ✅ NUEVO
  tasaCumplimientoMantenimiento,
  reportesGenerados: reportesPlanta.length,
  estadoGeneral,
  nivelActividad: Math.min((incidenciasPlanta.length + mantenimientosPlanta.length + reportesPlanta.length) / 10 * 100, 100)
    };
  }, [incidencias, mantenimientos, reportes]);

  // ✅ DATOS OPTIMIZADOS CON USEMEMO
  const datosOptimizados = useMemo(() => {
    const incidenciasPendientes = incidencias.filter(i => i.estado === 'pendiente').length;
    const incidenciasEnProgreso = incidencias.filter(i => i.estado === 'en_progreso').length;
    const incidenciasResueltas = incidencias.filter(i => i.estado === 'resuelto').length;
    const mantenimientosPendientes = mantenimientos.filter(m => m.estado !== 'completado').length;
    
    // Mantenimientos atrasados (fecha programada ya pasó)
    const mantenimientosAtrasados = mantenimientos.filter(m => 
      m.estado !== 'completado' && new Date(m.fechaProgramada) < new Date()
    ).length;

    const plantasUnicas = plantas.filter((planta, index, self) => 
      index === self.findIndex(p => p.id === planta.id)
    );

    const plantasConMetricas = plantasUnicas
      .map(planta => ({
        id: planta.id,
        nombre: planta.nombre,
        ubicacion: planta.ubicacion,
        ...calcularMetricasPlanta(planta.id)
      }))
      .slice(0, 5);

    return {
      // Métricas rápidas para tarjetas
      metricasRapidas: {
        incidenciasPendientes,
        incidenciasEnProgreso,
        incidenciasResueltas,
        mantenimientosPendientes,
        mantenimientosAtrasados,
        totalReportes: reportes?.length || 0
      },
      
      // Datos para gráficos
      graficos: {
        plantas: plantasConMetricas,
        incidencias: {
          pendientes: incidenciasPendientes,
          enProgreso: incidenciasEnProgreso,
          resueltas: incidenciasResueltas
        },
        metricasReales: metricas?.metricas
      },
      
      // Plantas para componentes
      plantasOptimizadas: plantasUnicas.slice(0, 8)
    };
  }, [plantas, incidencias, mantenimientos, reportes, metricas, calcularMetricasPlanta]);

  // ✅ CARGA ESTRATÉGICA DE DATOS - CORREGIDA
  useEffect(() => {
    if (esCliente) return;

    const cargarDatosCompletos = async () => {
      setCargandoSecciones(prev => ({ 
        ...prev, 
        metricas: true, 
        plantas: true,
        incidencias: true,
        mantenimientos: true,
        reportes: true 
      }));
      
      try {
        // ✅ CARGAR TODOS LOS DATOS ESENCIALES INICIALMENTE
      await Promise.allSettled([
  obtenerMetricas(),
  obtenerPlantas(12),
  obtenerIncidencias(15),
  obtenerMantenimientos(12),
  obtenerReportes(50, 1, true) // ✅ forzarRecarga: true
]);

        setCargandoSecciones({
          metricas: false,
          plantas: false,
          incidencias: false,
          mantenimientos: false,
          reportes: false
        });

      } catch (err) {
        console.error('Error cargando datos:', err);
        setCargandoSecciones({
          metricas: false,
          plantas: false,
          incidencias: false,
          mantenimientos: false,
          reportes: false
        });
      }
    };

    cargarDatosCompletos();
  }, [esCliente, esAdmin]);

  // ✅ LOADING PRECISO
  const loadingPrincipal = authLoading || cargandoSecciones.metricas || cargandoSecciones.plantas;
  const loadingContenido = cargandoSecciones.incidencias || cargandoSecciones.mantenimientos || cargandoSecciones.reportes;

  // ✅ SI ES CLIENTE, MOSTRAR ACCESO DENEGADO
  if (esCliente) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">
            Como cliente, puedes gestionar tus incidencias desde la sección correspondiente.
          </p>
          <button 
            onClick={() => window.location.href = '/incidencias'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Ir a Mis Incidencias
          </button>
        </div>
      </div>
    );
  }

  // ✅ SI NO TIENE PERMISOS, MOSTRAR ERROR
  if (!puedeVerDashboard && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin permisos</h2>
          <p className="text-gray-600">
            No tienes permisos para acceder al dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ✅ SKELETON LOADING MEJORADO
  if (loadingPrincipal) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          
          {/* Tarjetas Métricas Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          {/* Contenido Principal Skeleton */}
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
      {/* ✅ HEADER SIMPLIFICADO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {esAdmin ? 'Centro de Operaciones' : 'Panel Técnico'}
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {esAdmin ? 'Gestión completa del sistema' : 'Gestión técnica de plantas'}
            {user?.nombre && ` • ${user.nombre}`}
          </p>
        </div>
        
 
      </div>

      {/* ✅ TARJETAS DE CARGA DE TRABAJO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-orange-600">
            {datosOptimizados.metricasRapidas.incidenciasPendientes}
          </div>
          <div className="text-orange-700 font-medium">Incidencias Pendientes</div>
          <div className="text-sm text-orange-600 mt-2">Requieren atención inmediata</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">
            {datosOptimizados.metricasRapidas.mantenimientosPendientes}
          </div>
          <div className="text-blue-700 font-medium">Mantenimientos</div>
          <div className="text-sm text-blue-600 mt-2">Programados esta semana</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-red-600">
            {datosOptimizados.metricasRapidas.mantenimientosAtrasados}
          </div>
          <div className="text-red-700 font-medium">Atrasados</div>
          <div className="text-sm text-red-600 mt-2">Resolver urgentemente</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-green-600">
            {datosOptimizados.metricasRapidas.totalReportes}
          </div>
          <div className="text-green-700 font-medium">Reportes</div>
          <div className="text-sm text-green-600 mt-2">Generados este mes</div>
        </div>
      </div>

      {/* ✅ BOTÓN CREAR PLANTA SOLO PARA ADMIN */}
      {esAdmin && (
        <div className="flex justify-end">
          <button 
            onClick={() => window.location.href = '/plantas/crear'}
            className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <span className="text-lg">+</span>
            Crear Nueva Planta
          </button>
        </div>
      )}

      {/* ✅ MENSAJE DE ERROR */}
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

      {/* ✅ CONTENIDO PRINCIPAL */}
      {loadingContenido ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos del sistema...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <GraficosDashboard 
                  datos={datosOptimizados.graficos}
                  plantas={datosOptimizados.plantasOptimizadas}
                  incidencias={incidencias}
                  metricasReales={metricas?.metricas}
                />
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ResumenActividad 
                  incidencias={incidencias}
                  mantenimientos={mantenimientos}
                />
              </div>
            </div>

            {/* ✅ COLUMNA DERECHA - CONTENIDO NUEVO PARA EVITAR VACÍO */}
            <div className="space-y-6">
              {/* LISTA SIMPLE DE PLANTAS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Plantas Activas</h3>
                  <Link
                    to="/plantas"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {datosOptimizados.plantasOptimizadas.slice(0, 5).map((planta) => (
                    <Link 
                      key={planta.id} 
                      to={`/plantas/${planta.id}`}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {planta.nombre.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {planta.nombre}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{planta.ubicacion}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        planta.estadoGeneral === 'optimal' ? 'bg-green-400' :
                        planta.estadoGeneral === 'attention' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* RESUMEN RÁPIDO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Plantas totales</span>
                    <span className="font-semibold text-gray-900">{plantas.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Incidencias resueltas</span>
                    <span className="font-semibold text-green-600">
                      {datosOptimizados.metricasRapidas.incidenciasResueltas}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Reportes generados</span>
                    <span className="font-semibold text-blue-600">
                      {datosOptimizados.metricasRapidas.totalReportes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ ESTADO DEL SISTEMA */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Estado del Sistema</h3>
            <div className="flex items-center gap-4 text-blue-100">
              <p>
                {metricas?.metricas 
                  ? `${metricas.metricas.plantasActivas}/${metricas.metricas.totalPlantas} plantas activas` 
                  : 'Sistema operativo'
                }
              </p>
              {metricas?.metricas && (
                <div className="flex items-center gap-4 text-sm">
                  <span>Eficiencia: {metricas.metricas.eficienciaPromedio}%</span>
                  <span>•</span>
                  <span>Incidencias: {datosOptimizados.metricasRapidas.incidenciasPendientes}</span>
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