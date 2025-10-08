import { useEffect, useState } from 'react';
import { usePlantasStore } from '../stores/plantasStore';
import ModalPlanta from '../components/plantas/ModalPlanta';
import ListaPlantas from '../components/plantas/ListaPlantas';

export default function Plantas() {
  const { plantas, loading, error, obtenerPlantas } = usePlantasStore();
  const [showModal, setShowModal] = useState(false);
  const [plantaEditando, setPlantaEditando] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  useEffect(() => {
    obtenerPlantas();
  }, [obtenerPlantas]);

  const handleNuevaPlanta = () => {
    setPlantaEditando(null);
    setShowModal(true);
  };

  const handleEditarPlanta = (planta) => {
    setPlantaEditando(planta);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setPlantaEditando(null);
  };

  // Filtrar plantas basado en la búsqueda
  const plantasFiltradas = plantas.filter(planta =>
    planta.nombre?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    planta.ubicacion?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    planta.codigo?.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  if (loading && plantas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
          
          {/* Search bar skeleton */}
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
          
          {/* Plants list skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const estadisticas = {
    total: plantas.length,
    activas: plantas.filter(p => p.estado === 'activa').length,
    mantenimiento: plantas.filter(p => p.estado === 'mantenimiento').length,
    inactivas: plantas.filter(p => p.estado === 'inactiva').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Gestión de Plantas
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {estadisticas.total} plantas registradas en el sistema
          </p>
        </div>
        
        <button
          onClick={handleNuevaPlanta}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Planta
        </button>
      </div>

      {/* Mensaje de Error Mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-sm font-bold">!</span>
          </div>
          <div>
            <p className="font-medium">Error al cargar plantas</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar plantas por nombre, ubicación o código..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden sm:inline">Mostrando</span>
            <span className="font-semibold text-gray-700">{plantasFiltradas.length}</span>
            <span>de</span>
            <span className="font-semibold text-gray-700">{plantas.length}</span>
            <span>plantas</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plantas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.activas}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Mantenimiento</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.mantenimiento}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivas</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.inactivas}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Plantas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ListaPlantas 
          plantas={plantasFiltradas}
          onEditarPlanta={handleEditarPlanta}
          loading={loading}
        />
      </div>

      {/* Modal */}
      <ModalPlanta
        isOpen={showModal}
        onClose={handleCerrarModal}
        planta={plantaEditando}
      />
    </div>
  );
}