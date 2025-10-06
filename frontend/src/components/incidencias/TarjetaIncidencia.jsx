import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function TarjetaIncidencia({ incidencia, onEditar, onCambiarEstado }) {
  const { user, tieneRol } = useAuthStore();
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  // ✅ DEBUG en useEffect para ver el estado completo
  useEffect(() => {
    console.log('🔐 DEBUG COMPLETO Auth:', {
      usuario: user,
      rol: user?.rol,
      tieneRolAdmin: user?.rol === 'admin',
      tieneRolTecnico: user?.rol === 'tecnico',
      puedeEditar: user?.rol === 'admin' || user?.rol === 'tecnico',
      storeCompleto: useAuthStore.getState()
    });
  }, [user]);

  const obtenerNombrePlanta = () => {
    if (incidencia.plantaNombre) {
      return incidencia.plantaNombre;
    }
    return `Planta ${incidencia.plantId}`;
  };

  const estados = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    resuelto: { label: 'Resuelto', color: 'bg-green-100 text-green-800 border-green-200' }
  };

  const estadoActual = estados[incidencia.estado] || estados.pendiente;

  const handleCambioEstado = async (nuevoEstado) => {
    if (!onCambiarEstado) return;
    
    setCambiandoEstado(true);
    try {
      await onCambiarEstado(incidencia.id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const puedeEditar = user?.rol === 'admin' || user?.rol === 'tecnico';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoActual.color}`}>
              {estadoActual.label}
            </span>
            <span className="text-sm text-gray-500">
              #{incidencia.id}
            </span>
            {/* ✅ MOSTRAR INFORMACIÓN DEL USUARIO */}
            {user && (
              <span className={`text-xs px-2 py-1 rounded ${
                user.rol === 'admin' ? 'bg-red-100 text-red-800' : 
                user.rol === 'tecnico' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {user.nombre} ({user.rol || 'sin rol'})
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{incidencia.titulo}</h3>
          <p className="text-gray-600 mb-2">{incidencia.descripcion}</p>
        </div>
        
        {puedeEditar && (
          <div className="flex space-x-2">
            <button
              onClick={onEditar}
              className="text-gray-400 hover:text-primary-600 transition-colors p-1"
              title="Editar incidencia"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span>Planta: {obtenerNombrePlanta()}</span>
          <span className="mx-2">•</span>
          <span>Reportada: {new Date(incidencia.fechaReporte).toLocaleDateString()}</span>
          {incidencia.fechaResolucion && (
            <>
              <span className="mx-2">•</span>
              <span>Resuelta: {new Date(incidencia.fechaResolucion).toLocaleDateString()}</span>
            </>
          )}
        </div>

        {/* ✅ SELECTOR DE ESTADO VISIBLE SOLO CON PERMISOS */}
        {puedeEditar ? (
          <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg border border-green-200">
            <span className="text-xs text-green-700 font-medium">Cambiar estado:</span>
            <select
              value={incidencia.estado}
              onChange={(e) => handleCambioEstado(e.target.value)}
              disabled={cambiandoEstado}
              className="text-sm border border-green-300 rounded px-3 py-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            {cambiandoEstado && (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
            <span className="text-xs text-yellow-700">
              {user ? `Rol: ${user.rol} - Sin permisos para editar` : 'No autenticado'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}