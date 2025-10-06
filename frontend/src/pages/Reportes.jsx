// pages/Reportes.jsx
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
          <p className="text-gray-600">Genera y descarga reportes de las plantas</p>
        </div>
        
        {puedeGenerarReportes && (
          <button
            onClick={handleGenerarReporte}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            📊 Generar Reporte
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reportes</p>
              <p className="text-2xl font-bold text-gray-900">{reportes.length}</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plantas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{plantas.length}</p>
            </div>
            <div className="text-2xl">🏭</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
            <div className="text-2xl">📅</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planta
            </label>
            <select
              value={filtroPlanta}
              onChange={(e) => setFiltroPlanta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todas">Todas las plantas</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">
          Reportes cargados: {reportes.length}<br/>
          Plantas cargadas: {plantas.length}<br/>
          Usuario: {user?.nombre} ({user?.rol})
        </p>
      </div>
    </div>
  );
}