// pages/Reportes.jsx - MEJORADO
import { useEffect, useState } from 'react';
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
    generarReporte 
  } = useReportesStore();
  
  const { plantas, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [filtroPlanta, setFiltroPlanta] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    obtenerReportes(50);
    obtenerPlantas();
  }, [obtenerReportes, obtenerPlantas]);

  const handleGenerarReporte = () => {
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleDescargarReporte = async (rutaArchivo) => {
    try {
      await useReportesStore.getState().descargarReporte(rutaArchivo);
    } catch (error) {
      console.error('Error al descargar reporte:', error);
    }
  };

  // Filtrar reportes
  const reportesFiltrados = filtroPlanta === 'todas' 
    ? reportes 
    : reportes.filter(reporte => reporte.plantId === filtroPlanta);

  const puedeGenerarReportes = user?.rol === 'admin' || user?.rol === 'tecnico';

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
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Reportes del Sistema
            </h1>
            <p className="text-gray-600 mt-1">Genera y descarga reportes de las plantas</p>
          </div>
          
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reportes</p>
              <p className="text-2xl font-bold text-gray-900">{reportes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plantas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{plantas.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportes.filter(r => {
                  const reporteDate = new Date(r.fecha);
                  const now = new Date();
                  return reporteDate.getMonth() === now.getMonth() && 
                         reporteDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </div>

      {/* Lista de Reportes */}
      <ListaReportes 
        reportes={reportesFiltrados}
        plantas={plantas}
        onDescargarReporte={handleDescargarReporte}
        loading={loading}
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
          <h3 className="font-medium text-blue-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Debug Info
          </h3>
          <div className="text-sm text-blue-700 space-y-1 mt-2">
            <div><strong>Reportes cargados:</strong> {reportes.length}</div>
            <div><strong>Plantas cargadas:</strong> {plantas.length}</div>
            <div><strong>Usuario:</strong> {user?.nombre} ({user?.rol})</div>
          </div>
        </div>
      )}
    </div>
  );
}