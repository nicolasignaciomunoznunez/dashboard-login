import { useEffect, useState, useMemo, useCallback } from 'react';
import { useMantenimientoStore } from '../stores/mantenimientoStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useAuthStore } from '../stores/authStore';
import TarjetasMetricasMantenimiento from '../components/mantenimiento/TarjetasMetricasMantenimiento';
import ModalMantenimiento from '../components/mantenimiento/ModalMantenimiento';
import ListaMantenimientosPrincipal from '../components/mantenimiento/ListaMantenimientosPrincipal';

export default function Mantenimiento() {
  const { 
    mantenimientos, 
    loading: mantenimientosLoading, 
    error, 
    obtenerMantenimientos
  } = useMantenimientoStore();
  
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    tipo: 'todos',
    planta: 'todas',
    busqueda: ''
  });
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mantenimientoEditando, setMantenimientoEditando] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Carga inicial de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([obtenerMantenimientos(), obtenerPlantas()]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    cargarDatos();
  }, [obtenerMantenimientos, obtenerPlantas]);

  // Optimización: Cálculo de métricas con useMemo
  const metricas = useMemo(() => {
    if (mantenimientos.length === 0) {
      return { 
        total: 0, 
        pendientes: 0, 
        enProgreso: 0, 
        completados: 0, 
        proximosVencimientos: 0,
        criticos: 0
      };
    }

    const hoy = new Date();
    const pendientes = mantenimientos.filter(m => m.estado === 'pendiente');
    
    return {
      total: mantenimientos.length,
      pendientes: pendientes.length,
      enProgreso: mantenimientos.filter(m => m.estado === 'en_progreso').length,
      completados: mantenimientos.filter(m => m.estado === 'completado').length,
      proximosVencimientos: pendientes.filter(m => {
        const fechaProgramada = new Date(m.fechaProgramada);
        const diferenciaDias = Math.ceil((fechaProgramada - hoy) / (1000 * 60 * 60 * 24));
        return diferenciaDias <= 7 && diferenciaDias >= 0;
      }).length,
      criticos: pendientes.filter(m => {
        const fechaProgramada = new Date(m.fechaProgramada);
        const diferenciaDias = Math.ceil((fechaProgramada - hoy) / (1000 * 60 * 60 * 24));
        return diferenciaDias <= 3 && diferenciaDias >= 0;
      }).length
    };
  }, [mantenimientos]);

  // Optimización: Filtrado con useMemo
  const mantenimientosFiltrados = useMemo(() => {
    return mantenimientos.filter(mantenimiento => {
      // Filtro por estado
      if (filtros.estado !== 'todos' && mantenimiento.estado !== filtros.estado) {
        return false;
      }
      
      // Filtro por tipo
      if (filtros.tipo !== 'todos' && mantenimiento.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro por planta
      if (filtros.planta !== 'todas') {
        const plantaMantenimiento = plantas.find(p => p.id === mantenimiento.plantId);
        if (!plantaMantenimiento || plantaMantenimiento.id !== filtros.planta) {
          return false;
        }
      }
      
      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const plantaMantenimiento = plantas.find(p => p.id === mantenimiento.plantId);
        const nombrePlanta = plantaMantenimiento?.nombre?.toLowerCase() || '';
        
        return (
          mantenimiento.descripcion?.toLowerCase().includes(busqueda) ||
          nombrePlanta.includes(busqueda) ||
          mantenimiento.tipo?.toLowerCase().includes(busqueda) ||
          mantenimiento.estado?.toLowerCase().includes(busqueda) ||
          mantenimiento.prioridad?.toLowerCase().includes(busqueda)
        );
      }
      
      return true;
    });
  }, [mantenimientos, plantas, filtros]);

  // Optimización: Enriquecimiento de datos
  const mantenimientosEnriquecidos = useMemo(() => {
    return mantenimientosFiltrados.map(mantenimiento => {
      const planta = plantas.find(p => p.id === mantenimiento.plantId);
      
      // Calcular días restantes para mantenimientos pendientes
      let diasRestantes = null;
      if (mantenimiento.estado === 'pendiente' && mantenimiento.fechaProgramada) {
        const hoy = new Date();
        const fechaProgramada = new Date(mantenimiento.fechaProgramada);
        diasRestantes = Math.ceil((fechaProgramada - hoy) / (1000 * 60 * 60 * 24));
      }
      
      return {
        ...mantenimiento,
        plantaNombre: planta?.nombre || 'Planta no encontrada',
        plantaUbicacion: planta?.ubicacion || '',
        diasRestantes
      };
    });
  }, [mantenimientosFiltrados, plantas]);

  // Handlers optimizados con useCallback
  const handleAbrirModalNuevo = useCallback(() => {
    setMantenimientoEditando(null);
    setModalAbierto(true);
  }, []);

  const handleAbrirModalEditar = useCallback((mantenimiento) => {
    setMantenimientoEditando(mantenimiento);
    setModalAbierto(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setModalAbierto(false);
    setMantenimientoEditando(null);
  }, []);

  const handleFiltroChange = useCallback((e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      estado: 'todos',
      tipo: 'todos',
      planta: 'todas',
      busqueda: ''
    });
  }, []);

  // Función para refresh manual
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([obtenerMantenimientos(), obtenerPlantas()]);
    } catch (error) {
      console.error('Error refrescando datos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Función para exportar datos
  const handleExportarDatos = () => {
    const datosExportar = mantenimientosEnriquecidos.map(m => ({
      'ID': m.id,
      'Descripción': m.descripcion,
      'Tipo': m.tipo,
      'Estado': m.estado,
      'Prioridad': m.prioridad,
      'Planta': m.plantaNombre,
      'Fecha Programada': m.fechaProgramada,
      'Fecha Completado': m.fechaCompletado || 'N/A',
      'Días Restantes': m.diasRestantes || 'N/A'
    }));

    const csv = [
      Object.keys(datosExportar[0]).join(','),
      ...datosExportar.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mantenimientos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loading = mantenimientosLoading || plantasLoading;
  const puedeGestionar = user?.rol === 'admin' || user?.rol === 'tecnico';
  const hayResultados = mantenimientosFiltrados.length > 0;
  const hayFiltrosActivos = filtros.estado !== 'todos' || filtros.tipo !== 'todos' || filtros.planta !== 'todas' || filtros.busqueda;

  // Loading state mejorado
  if (loading && mantenimientos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
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
      {/* Header Mejorado con Acciones */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Gestión de Mantenimiento
            </h1>
            {refreshing && (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Programa y supervisa los mantenimientos del sistema de agua
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
            onClick={handleExportarDatos}
            disabled={mantenimientosEnriquecidos.length === 0}
            className="px-4 py-3 border border-green-300 text-green-700 rounded-xl font-medium hover:bg-green-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          
          {puedeGestionar && (
            <button
              onClick={handleAbrirModalNuevo}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Programar Mantenimiento
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de Error Mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Error al cargar mantenimientos</p>
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

      {/* Tarjetas de Métricas */}
      <TarjetasMetricasMantenimiento 
        metricas={metricas} 
        onMetricaClick={(tipo) => {
          // Filtrado rápido al hacer click en métricas
          switch(tipo) {
            case 'pendientes':
              setFiltros(prev => ({ ...prev, estado: 'pendiente' }));
              break;
            case 'proximosVencimientos':
              setFiltros(prev => ({ ...prev, estado: 'pendiente' }));
              break;
            case 'criticos':
              setFiltros(prev => ({ ...prev, estado: 'pendiente' }));
              break;
            case 'enProgreso':
              setFiltros(prev => ({ ...prev, estado: 'en_progreso' }));
              break;
            case 'completados':
              setFiltros(prev => ({ ...prev, estado: 'completado' }));
              break;
            default:
              break;
          }
        }}
      />

      {/* Filtros Mejorados */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Mostrando</span>
            <span className="font-semibold text-gray-700">{mantenimientosFiltrados.length}</span>
            <span>de</span>
            <span className="font-semibold text-gray-700">{mantenimientos.length}</span>
            <span>mantenimientos</span>
            {hayFiltrosActivos && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Filtrado
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar mantenimientos
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
                placeholder="Buscar por descripción, planta, tipo..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-colors hover:border-gray-400"
              />
            </div>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
            >
              <option value="todos">Todos los tipos</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="predictivo">Predictivo</option>
            </select>
          </div>

          {/* Filtro Planta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planta
            </label>
            <select
              name="planta"
              value={filtros.planta}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
            >
              <option value="todas">Todas las plantas</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {hayFiltrosActivos && (
          <div className="flex justify-end mt-4">
            <button
              onClick={limpiarFiltros}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors px-3 py-1 hover:bg-blue-50 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de Mantenimientos */}
      {hayResultados ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ListaMantenimientosPrincipal 
            mantenimientos={mantenimientosEnriquecidos}
            onEditarMantenimiento={handleAbrirModalEditar}
            loading={loading}
            puedeGestionar={puedeGestionar}
          />
        </div>
      ) : (
        /* Empty State mejorado */
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {mantenimientos.length === 0 ? 'No hay mantenimientos' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {mantenimientos.length === 0 
              ? 'Comienza programando el primer mantenimiento para tu sistema de plantas de agua.'
              : 'Intenta ajustar los filtros de búsqueda o limpiar los filtros activos.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
            {puedeGestionar && (
              <button
                onClick={handleAbrirModalNuevo}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Programar Mantenimiento
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <ModalMantenimiento
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        mantenimiento={mantenimientoEditando}
        onMantenimientoGuardado={() => {
          handleCerrarModal();
          obtenerMantenimientos(); // Refrescar la lista
        }}
      />

      {/* Debug Info - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 text-sm mb-2">Debug Info:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Mantenimientos: {mantenimientos.length} | Filtrados: {mantenimientosFiltrados.length}</p>
            <p>Plantas: {plantas.length} | Usuario: {user?.nombre} ({user?.rol})</p>
            <p>Filtros activos: {JSON.stringify(filtros)}</p>
          </div>
        </div>
      )}
    </div>
  );
}