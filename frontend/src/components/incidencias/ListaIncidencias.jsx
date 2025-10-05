import { useIncidenciasStore } from '../../stores/incidenciasStore';
import TarjetaIncidencia from './TarjetaIncidencia';

export default function ListaIncidencias({ incidencias, onEditarIncidencia, loading }) {
  const { cambiarEstadoIncidencia } = useIncidenciasStore();

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoIncidencia(id, nuevoEstado);
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  if (incidencias.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay incidencias</h3>
        <p className="text-gray-500">Todas las plantas están operando normalmente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidencias.map((incidencia) => (
        <TarjetaIncidencia
          key={incidencia.id}
          incidencia={incidencia}
          onEditar={() => onEditarIncidencia(incidencia)}
          onCambiarEstado={handleCambiarEstado}
        />
      ))}
    </div>
  );
}