import { useEffect, useState, useMemo, useCallback } from 'react';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useAuthStore } from '../stores/authStore';
import ModalIncidencia from '../components/incidencias/ModalIncidencia';
import ListaIncidencias from '../components/incidencias/ListaIncidencias';

export default function Incidencias() {
  const { 
    incidencias, 
    loading, 
    error, 
    obtenerIncidencias, 
    cambiarEstadoIncidencia
  } = useIncidenciasStore();
  
  const { user } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [incidenciaEditando, setIncidenciaEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Carga inicial optimizada
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await obtenerIncidencias(50);
      } catch (error) {
        console.error('Error cargando incidencias:', error);
      }
    };
    
    cargarDatos();
  }, [obtenerIncidencias]);

  // Handlers optimizados con useCallback
  const handleNuevaIncidencia = useCallback(() => {
    setIncidenciaEditando(null);
    setShowModal(true);
  }, []);

  const handleEditarIncidencia = useCallback((incidencia) => {
    setIncidenciaEditando(incidencia);
    setShowModal(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setShowModal(false);
    setIncidenciaEditando(null);
  }, []);

  const handleCambiarEstado = useCallback(async (id, nuevoEstado) => {
    try {
      await cambiarEstadoIncidencia(id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      // Podrías mostrar un toast de error aquí
    }
  }, [cambiarEstadoIncidencia]);

  // Refresh manual
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await obtenerIncidencias(50);
    } catch (error) {
      console.error('Error refrescando incidencias:', error);
    } finally {
      setRefreshing(false);
    }
  }, [obtenerIncidencias]);

  // Optimizar cálculos de estadísticas
  const estadisticas = useMemo(() => {
    return {
      total: incidencias.length,
      pendientes: incidencias.filter(i => i.estado === 'pendiente').length,
      enProgreso: incidencias.filter(i => i.estado === 'en_progreso').length,
      resueltas: incidencias.filter(i => i.estado === 'resuelto').length,
      criticas: incidencias.filter(i => i.prioridad === 'critica' && i.estado !== 'resuelto').length,
    };
  }, [incidencias]);

  // Optimizar filtrado
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter(incidencia => {
      const coincideEstado = filtroEstado === 'todos' || incidencia.estado === filtroEstado;
      const coincideBusqueda = filtroBusqueda === '' || 
        incidencia.titulo?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.descripcion?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.plantaNombre?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        incidencia.prioridad?.toLowerCase().includes(filtroBusqueda.toLowerCase());
      
      return coincideEstado && coincideBusqueda;
    });
  }, [incidencias, filtroEstado, filtroBusqueda]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltroEstado('todos');
    setFiltroBusqueda('');
  }, []);

  const puedeGestionar = user?.rol === 'admin' || user?.rol === 'tecnico';
  const hayFiltrosActivos = filtroEstado !== 'todos' || filtroBusqueda !== '';

  // Función para exportar incidencias
  const handleExportarIncidencias = useCallback(() => {
    const datosExportar = incidenciasFiltradas.map(incidencia => ({
      'ID': incidencia.id,
      'Título': incidencia.titulo,
      'Descripción': incidencia.descripcion,
      'Estado': incidencia.estado,
      'Prioridad': incidencia.prioridad,
      'Planta': incidencia.plantaNombre,
      'Fecha Reporte': incidencia.fechaReporte,
      'Fecha Resolución': incidencia.fechaResolucion || 'N/A',
      'Reportado Por': incidencia.reportadoPor || 'N/A'
    }));

    const csv = [
      Object.keys(datosExportar[0]).join(','),
      ...datosExportar.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidencias-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [incidenciasFiltradas]);

  if (loading && incidencias.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          {/* Filters skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Gestión de Incidencias
            </h1>
            {refreshing && (
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Monitorea y gestiona los problemas reportados en las plantas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>

          <button
            onClick={handleExportarIncidencias}
            disabled={incidenciasFiltradas.length === 0}
            className="px-4 py-3 border border-green-300 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          
          <button
            onClick={handleNuevaIncidencia}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reportar Incidencia
          </button>
        </div>
      </div>

      {/* Mensaje de Error Mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Error al cargar incidencias</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="text-red-700 hover:text-red-800 font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tarjetas de Estadísticas Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('todos')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('pendiente')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.pendientes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('en_progreso')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.enProgreso}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setFiltroEstado('resuelto')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.resueltas}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.criticas}</p>
              <p className="text-xs text-red-500 mt-1">Requieren atención inmediata</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda Mejorados */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar incidencias por título, descripción, planta o prioridad..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-colors hover:border-gray-300"
              />
            </div>

            {/* Filtro por estado */}
            <div className="relative">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-colors min-w-[180px]"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_progreso">En Progreso</option>
                <option value="resuelto">Resueltos</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar Filtros
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden sm:inline">Mostrando</span>
            <span className="font-semibold text-gray-700">{incidenciasFiltradas.length}</span>
            <span>de</span>
            <span className="font-semibold text-gray-700">{incidencias.length}</span>
            <span>incidencias</span>
            {hayFiltrosActivos && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Filtrado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ListaIncidencias 
          incidencias={incidenciasFiltradas}
          onEditarIncidencia={handleEditarIncidencia}
          onCambiarEstado={handleCambiarEstado}
          loading={loading}
          puedeGestionar={puedeGestionar}
        />
      </div>

      {/* Empty State cuando no hay resultados */}
      {incidenciasFiltradas.length === 0 && incidencias.length > 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron incidencias</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {hayFiltrosActivos 
              ? 'Intenta ajustar los filtros de búsqueda o limpiar los filtros activos.'
              : 'No hay incidencias que coincidan con los criterios actuales.'
            }
          </p>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Empty State cuando no hay incidencias */}
      {incidencias.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡No hay incidencias reportadas!</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Todas las plantas están funcionando correctamente. Puedes reportar una nueva incidencia cuando sea necesario.
          </p>
          <button
            onClick={handleNuevaIncidencia}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Reportar Primera Incidencia
          </button>
        </div>
      )}

      {/* Modal */}
      <ModalIncidencia
        isOpen={showModal}
        onClose={handleCerrarModal}
        incidencia={incidenciaEditando}
        onIncidenciaGuardada={() => {
          handleCerrarModal();
          obtenerIncidencias(50); // Refrescar la lista
        }}
      />

      {/* Debug Info - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 text-sm mb-2">Debug Info:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Incidencias: {incidenciasFiltradas.length} filtradas de {incidencias.length} totales</p>
            <p>Usuario: {user?.nombre} ({user?.rol})</p>
            <p>Filtros: estado="{filtroEstado}", búsqueda="{filtroBusqueda}"</p>
          </div>
        </div>
      )}
    </div>
  );
}