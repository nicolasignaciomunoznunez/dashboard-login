// ❌ ELIMINA todo el código actual de Reportes.jsx
// ✅ PEGA este nuevo código completo:

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useReportesStore } from '../stores/reportesStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useAuthStore } from '../stores/authStore';
import ModalReporte from '../components/reportes/ModalReporte';
import ListaReportes from '../components/reportes/ListaReportes';

export default function Reportes() {
  const { 
    reportes, 
    loading, 
    error, 
    obtenerReportes,
    descargarReporte,
    eliminarReporte
  } = useReportesStore();
  
  const { plantas, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [filtroPlanta, setFiltroPlanta] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Carga inicial optimizada
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([obtenerReportes(50), obtenerPlantas()]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    cargarDatos();
  }, [obtenerReportes, obtenerPlantas]);

  // Handlers optimizados con useCallback
  const handleGenerarReporte = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setModalAbierto(false);
  }, []);

  const handleDescargarReporte = useCallback(async (reporteId) => {
    try {
      await descargarReporte(reporteId);
    } catch (error) {
      console.error('Error al descargar reporte:', error);
    }
  }, [descargarReporte]);

  // ✅ CORRECCIÓN CRÍTICA: Función corregida
  const handleEliminarReporte = useCallback(async (reporteId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      return;
    }
    
    try {
      await eliminarReporte(reporteId);
      // Refrescar la lista después de eliminar
      await obtenerReportes(50);
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      alert('Error al eliminar el reporte: ' + error.message);
    }
  }, [eliminarReporte, obtenerReportes]);

  // Refresh manual
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([obtenerReportes(50), obtenerPlantas()]);
    } catch (error) {
      console.error('Error refrescando datos:', error);
    } finally {
      setRefreshing(false);
    }
  }, [obtenerReportes, obtenerPlantas]);

  // Filtros optimizados
  const reportesFiltrados = useMemo(() => {
    let filtrados = reportes;

    // Filtro por planta
    if (filtroPlanta !== 'todas') {
      const plantIdFiltro = parseInt(filtroPlanta);
      filtrados = filtrados.filter(reporte => 
        parseInt(reporte.plantId) === plantIdFiltro
      );
    }

    // Filtro por fechas
    if (fechaInicio) {
      const fechaInicioFiltro = new Date(fechaInicio);
      filtrados = filtrados.filter(reporte => 
        new Date(reporte.fecha) >= fechaInicioFiltro
      );
    }
    
    if (fechaFin) {
      const fechaFinFiltro = new Date(fechaFin);
      filtrados = filtrados.filter(reporte => 
        new Date(reporte.fecha) <= fechaFinFiltro
      );
    }

    return filtrados;
  }, [reportes, filtroPlanta, fechaInicio, fechaFin]);

  // Métricas optimizadas
  const metricas = useMemo(() => {
    const ahora = new Date();
    const reportesEsteMes = reportes.filter(r => {
      const fechaReporte = new Date(r.fecha);
      return fechaReporte.getMonth() === ahora.getMonth() && 
             fechaReporte.getFullYear() === ahora.getFullYear();
    });

    return {
      total: reportes.length,
      plantasActivas: plantas.length,
      esteMes: reportesEsteMes.length
    };
  }, [reportes, plantas]);

  const puedeGenerarReportes = user?.rol === 'admin' || user?.rol === 'tecnico';
  const hayFiltrosActivos = filtroPlanta !== 'todas' || fechaInicio || fechaFin;

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setFiltroPlanta('todas');
    setFechaInicio('');
    setFechaFin('');
  }, []);

  // Loading state
  if (loading && reportes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          
          {/* Métricas skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          
          {/* Filtros skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/6 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Mejorado */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reportes del Sistema
              </h1>
              {refreshing && (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Genera y descarga reportes de las plantas de agua
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
            
            {puedeGenerarReportes && (
              <button
                onClick={handleGenerarReporte}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generar Reporte
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de Error Mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-sm font-bold">!</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Error al cargar reportes</p>
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

      {/* Estadísticas rápidas - Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reportes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.total}</p>
              <p className="text-xs text-gray-500 mt-1">{metricas.esteMes} este mes</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
              📊
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plantas Activas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.plantasActivas}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">
              🏭
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reportes Este Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.esteMes}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
              📅
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Mejorados */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Mostrando</span>
            <span className="font-semibold text-gray-700">{reportesFiltrados.length}</span>
            <span>de</span>
            <span className="font-semibold text-gray-700">{reportes.length}</span>
            <span>reportes</span>
            {hayFiltrosActivos && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Filtrado
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Planta
            </label>
            <select
              value={filtroPlanta}
              onChange={(e) => setFiltroPlanta(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            >
              <option value="todas">Todas las plantas</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Botón limpiar filtros */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 opacity-0">
              Acciones
            </label>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Reportes */}
      <ListaReportes 
        reportes={reportesFiltrados}
        plantas={plantas}
        onDescargarReporte={handleDescargarReporte}
        onEliminarReporte={handleEliminarReporte}
        loading={loading}
        puedeGestionar={puedeGenerarReportes}
      />

      {/* Modal para generar reportes */}
      <ModalReporte
        isOpen={showModal}
        onClose={handleCerrarModal}
        plantas={plantas}
      />

      {/* Debug Info - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Debug Info
          </h3>
          <div className="text-xs text-blue-700 space-y-1 mt-2">
            <div><strong>Reportes:</strong> {reportesFiltrados.length} filtrados de {reportes.length} totales</div>
            <div><strong>Plantas:</strong> {plantas.length} cargadas</div>
            <div><strong>Usuario:</strong> {user?.nombre} ({user?.rol})</div>
          </div>
        </div>
      )}
    </div>
  );
}