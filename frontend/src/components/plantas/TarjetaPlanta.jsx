import { Link } from 'react-router-dom';

export default function TarjetaPlanta({ planta, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{planta.nombre}</h3>
          <div className="flex space-x-2">
            <button
              onClick={onEditar}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title="Editar planta"
            >
              ✏️
            </button>
            <button
              onClick={onEliminar}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Eliminar planta"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-4 mr-2">📍</span>
            <span>{planta.ubicacion || 'Sin ubicación especificada'}</span>
          </div>
          
          {planta.clienteNombre && (
            <div className="flex items-center">
              <span className="w-4 mr-2">👤</span>
              <span>Cliente: {planta.clienteNombre}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
  to={`/plantas/${planta.id}`}
  className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-4 rounded text-sm font-medium text-center block transition-colors"
>
  Ver Detalles
</Link>
        </div>
      </div>
    </div>
  );
}