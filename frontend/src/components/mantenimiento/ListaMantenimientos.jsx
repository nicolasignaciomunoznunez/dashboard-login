// components/mantenimiento/ListaMantenimientos.jsx
import { useState, useEffect } from 'react';
import { useMantenimientoStore } from '../../stores/mantenimientoStore';
import ModalMantenimiento from './ModalMantenimiento'; // ✅ Sin llaves
import ChecklistMantenimiento from './ChecklistMantenimiento'; // ✅ Sin llaves

export default function ListaMantenimientos({ plantaId, soloLectura = false }) {
  const { mantenimientos, loading, obtenerMantenimientosPlanta, cambiarEstadoMantenimiento } = useMantenimientoStore();
  const [showModal, setShowModal] = useState(false);
  const [mantenimientoEdit, setMantenimientoEdit] = useState(null);
  const [showChecklist, setShowChecklist] = useState(null);

  useEffect(() => {
    if (plantaId) {
      obtenerMantenimientosPlanta(plantaId);
    }
  }, [plantaId, obtenerMantenimientosPlanta]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoMantenimiento(id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'completado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    return tipo === 'preventivo' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-orange-100 text-orange-800';
  };

  if (loading && mantenimientos.length === 0) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón de agregar */}
      {!soloLectura && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Mantenimientos Programados</h3>
        <button
  onClick={() => {
    console.log('🎯 Abriendo modal de mantenimiento...');
    setShowModal(true);
  }}
  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded text-sm font-medium"
>
  + Programar Mantenimiento
</button>
        </div>
      )}

      {/* Lista de mantenimientos */}
      <div className="space-y-3">
        {mantenimientos.map((mantenimiento) => (
          <div key={mantenimiento.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(mantenimiento.tipo)}`}>
                    {mantenimiento.tipo}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(mantenimiento.estado)}`}>
                    {mantenimiento.estado}
                  </span>
                </div>
                
                <p className="text-gray-900 font-medium">{mantenimiento.descripcion}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>📅 Programado: {new Date(mantenimiento.fechaProgramada).toLocaleDateString()}</span>
                  {mantenimiento.fechaRealizada && (
                    <span>✅ Realizado: {new Date(mantenimiento.fechaRealizada).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {!soloLectura && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowChecklist(mantenimiento.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Checklist
                  </button>
                  <button
                    onClick={() => setMantenimientoEdit(mantenimiento)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Controles de estado para técnicos/admin */}
            {!soloLectura && (mantenimiento.estado === 'pendiente' || mantenimiento.estado === 'en_progreso') && (
              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                {mantenimiento.estado === 'pendiente' && (
                  <button
                    onClick={() => handleCambiarEstado(mantenimiento.id, 'en_progreso')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Iniciar
                  </button>
                )}
                {mantenimiento.estado === 'en_progreso' && (
                  <button
                    onClick={() => handleCambiarEstado(mantenimiento.id, 'completado')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Completar
                  </button>
                )}
              </div>
            )}

            {/* Checklist expandible */}
            {showChecklist === mantenimiento.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <ChecklistMantenimiento 
                  mantenimientoId={mantenimiento.id} 
                  readonly={mantenimiento.estado === 'completado'}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {mantenimientos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔧</div>
          <p>No hay mantenimientos programados</p>
          {!soloLectura && <p className="text-sm">Programa el primer mantenimiento</p>}
        </div>
      )}

      {/* Modales */}
      <ModalMantenimiento
        isOpen={showModal || !!mantenimientoEdit}
        onClose={() => {
          setShowModal(false);
          setMantenimientoEdit(null);
        }}
        mantenimiento={mantenimientoEdit}
        plantaPreSeleccionada={plantaId}
      />
    </div>
  );
}