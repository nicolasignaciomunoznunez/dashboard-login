import { useEffect, useState } from 'react';
import { useMantenimientoStore } from '../stores/mantenimientoStore';
import { usePlantasStore } from '../stores/plantasStore';
import { useAuthStore } from '../stores/authStore';
import TarjetasMetricasMantenimiento from '../components/mantenimiento/TarjetasMetricasMantenimiento';
import ListaMantenimientos from '../components/mantenimiento/ListaMantenimientos';
import ModalMantenimiento from '../components/mantenimiento/ModalMantenimiento';

export default function Mantenimiento() {
  const { 
    mantenimientos, 
    loading: mantenimientosLoading, 
    error, 
    obtenerMantenimientos,
    obtenerMetricasMantenimiento 
  } = useMantenimientoStore();
  
  const { plantas, loading: plantasLoading, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [metricas, setMetricas] = useState({
    total: 0,
    pendientes: 0,
    enProgreso: 0,
    completados: 0,
    proximosVencimientos: 0
  });
  
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    tipo: 'todos',
    planta: 'todas'
  });
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mantenimientoEditando, setMantenimientoEditando] = useState(null);

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    obtenerMantenimientos();
    obtenerPlantas();
  }, []);

  // ✅ Calcular métricas cuando cambian los mantenimientos
  useEffect(() => {
    if (mantenimientos.length > 0) {
      const total = mantenimientos.length;
      const pendientes = mantenimientos.filter(m => m.estado === 'pendiente').length;
      const enProgreso = mantenimientos.filter(m => m.estado === 'en_progreso').length;
      const completados = mantenimientos.filter(m => m.estado === 'completado').length;
      
      // Contar mantenimientos próximos a vencer (en los próximos 7 días)
      const hoy = new Date();
      const proximosVencimientos = mantenimientos.filter(m => {
        if (m.estado !== 'pendiente') return false;
        const fechaProgramada = new Date(m.fechaProgramada);
        const diferenciaDias = Math.ceil((fechaProgramada - hoy) / (1000 * 60 * 60 * 24));
        return diferenciaDias <= 7 && diferenciaDias >= 0;
      }).length;

      setMetricas({
        total,
        pendientes,
        enProgreso,
        completados,
        proximosVencimientos
      });
    }
  }, [mantenimientos]);

  // ✅ Filtrar mantenimientos según los filtros aplicados
  const mantenimientosFiltrados = mantenimientos.filter(mantenimiento => {
    // Filtro por estado
    if (filtros.estado !== 'todos' && mantenimiento.estado !== filtros.estado) {
      return false;
    }
    
    // Filtro por tipo
    if (filtros.tipo !== 'todos' && mantenimiento.tipo !== filtros.tipo) {
      return false;
    }
    
    // Filtro por planta
    if (filtros.planta !== 'todas' && mantenimiento.plantId !== filtros.planta) {
      return false;
    }
    
    return true;
  });

  const handleAbrirModalNuevo = () => {
    setMantenimientoEditando(null);
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (mantenimiento) => {
    setMantenimientoEditando(mantenimiento);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setMantenimientoEditando(null);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loading = mantenimientosLoading || plantasLoading;

  if (loading && mantenimientos.length === 0) {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Mantenimiento</h1>
          <p className="text-gray-600">Programa y gestiona mantenimientos del sistema</p>
        </div>
        
        {(user?.rol === 'admin' || user?.rol === 'tecnico') && (
          <button
            onClick={handleAbrirModalNuevo}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Programar Mantenimiento
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tarjetas de Métricas de Mantenimiento */}
      <TarjetasMetricasMantenimiento metricas={metricas} />

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planta
            </label>
            <select
              name="planta"
              value={filtros.planta}
              onChange={handleFiltroChange}
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
        </div>
      </div>

      {/* Lista de Mantenimientos */}
      <ListaMantenimientos 
        mantenimientos={mantenimientosFiltrados}
        plantas={plantas}
        onEditarMantenimiento={handleAbrirModalEditar}
        usuario={user}
      />

      {/* Modal para crear/editar mantenimiento */}
      <ModalMantenimiento
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        mantenimiento={mantenimientoEditando}
      />

      {/* ✅ DEBUG TEMPORAL */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800">Debug Info:</h3>
        <p className="text-sm text-blue-700">
          Mantenimientos cargados: {mantenimientos.length}<br/>
          Mantenimientos filtrados: {mantenimientosFiltrados.length}<br/>
          Plantas cargadas: {plantas.length}
        </p>
      </div>
    </div>
  );
}