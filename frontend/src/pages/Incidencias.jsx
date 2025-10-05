import { useEffect, useState } from 'react';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import ModalIncidencia from '../components/incidencias/ModalIncidencia';
import ListaIncidencias from '../components/incidencias/ListaIncidencias';

export default function Incidencias() {
  const { incidencias, loading, error, obtenerIncidencias } = useIncidenciasStore();
  const [showModal, setShowModal] = useState(false);
  const [incidenciaEditando, setIncidenciaEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    obtenerIncidencias(50);
  }, [obtenerIncidencias]);

  const handleNuevaIncidencia = () => {
    setIncidenciaEditando(null);
    setShowModal(true);
  };

  const handleEditarIncidencia = (incidencia) => {
    setIncidenciaEditando(incidencia);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setIncidenciaEditando(null);
  };

  // Filtrar incidencias por estado
  const incidenciasFiltradas = filtroEstado === 'todos' 
    ? incidencias 
    : incidencias.filter(incidencia => incidencia.estado === filtroEstado);

  if (loading && incidencias.length === 0) {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Incidencias</h1>
          <p className="text-gray-600">Reportar y seguir problemas en las plantas</p>
        </div>
        <button
          onClick={handleNuevaIncidencia}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Reportar Incidencia
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resueltos</option>
          </select>
          <span className="text-sm text-gray-600">
            {incidenciasFiltradas.length} de {incidencias.length} incidencias
          </span>
        </div>
      </div>

      <ListaIncidencias 
        incidencias={incidenciasFiltradas}
        onEditarIncidencia={handleEditarIncidencia}
        loading={loading}
      />

      <ModalIncidencia
        isOpen={showModal}
        onClose={handleCerrarModal}
        incidencia={incidenciaEditando}
      />
    </div>
  );
}