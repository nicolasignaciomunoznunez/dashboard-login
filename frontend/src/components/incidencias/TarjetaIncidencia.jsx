import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function TarjetaIncidencia({ incidencia, onEditar, onCambiarEstado }) {
  const { user } = useAuthStore();
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const estados = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    resuelto: { label: 'Resuelto', color: 'bg-green-100 text-green-800 border-green-200' }
  };

  const estadoActual = estados[incidencia.estado] || estados.pendiente;

  const handleCambioEstado = async (nuevoEstado) => {
    setCambiandoEstado(true);
    try {
      await onCambiarEstado(incidencia.id, nuevoEstado);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const puedeEditar = user?.rol === 'admin' || user?.rol === 'tecnico';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoActual.color}`}>
              {estadoActual.label}
            </span>
            <span className="text-sm text-gray-500">
              #{incidencia.id}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{incidencia.titulo}</h3>
          <p className="text-gray-600 mb-2">{incidencia.descripcion}</p>
        </div>
        
        {puedeEditar && (
          <div className="flex space-x-2">
            <button
              onClick={onEditar}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title="Editar incidencia"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span>Planta: {incidencia.plantaNombre}</span>
          <span className="mx-2">•</span>
          <span>Reportada: {new Date(incidencia.fechaReporte).toLocaleDateString()}</span>
          {incidencia.fechaResolucion && (
            <>
              <span className="mx-2">•</span>
              <span>Resuelta: {new Date(incidencia.fechaResolucion).toLocaleDateString()}</span>
            </>
          )}
        </div>

        {puedeEditar && incidencia.estado !== 'resuelto' && (
          <div className="flex space-x-2">
            <select
              value={incidencia.estado}
              onChange={(e) => handleCambioEstado(e.target.value)}
              disabled={cambiandoEstado}
              className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}