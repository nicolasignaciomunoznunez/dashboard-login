import { Link } from 'react-router-dom';

export default function TarjetaPlanta({ planta, onEditar, onEliminar }) {
  // Determinar el estado visual de la planta
  const getEstadoPlanta = () => {
    if (planta.estado === 'mantenimiento') {
      return { 
        texto: 'En Mantenimiento', 
        color: 'blue', 
        icono: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      };
    }
    if (planta.estado === 'inactiva') {
      return { 
        texto: 'Inactiva', 
        color: 'gray', 
        icono: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
    return { 
      texto: 'Operativa', 
      color: 'green', 
      icono: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    };
  };

  const estado = getEstadoPlanta();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200 group">
      <div className="p-6">
        {/* Header con título y acciones */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {planta.nombre}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                estado.color === 'green' ? 'bg-green-50 text-green-700 border border-green-200' :
                estado.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {estado.icono}
                {estado.texto}
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-1 ml-3">
            <button
              onClick={onEditar}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/btn"
              title="Editar planta"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onEliminar}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
              title="Eliminar planta"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Información de la planta */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">Ubicación</p>
              <p className="text-gray-900 truncate">{planta.ubicacion || 'Sin ubicación especificada'}</p>
            </div>
          </div>
          
          {planta.clienteNombre && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">Cliente</p>
                <p className="text-gray-900 truncate">{planta.clienteNombre}</p>
              </div>
            </div>
          )}

          {/* Información adicional si está disponible */}
          {planta.capacidad && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">Capacidad</p>
                <p className="text-gray-900">{planta.capacidad} L</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/dashboard/plantas/${planta.id}`}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-xl text-sm font-medium text-center block transition-all duration-200 group/link hover:shadow-sm border border-blue-200 hover:border-blue-300 flex items-center justify-center gap-2"
          >
            <span>Ver Detalles</span>
            <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}