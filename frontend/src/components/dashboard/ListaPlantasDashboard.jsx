import { Link } from 'react-router-dom';

export default function ListaPlantasDashboard({ plantas = [] }) { // Valor por defecto
  // Validar que plantas sea un array
  if (!Array.isArray(plantas)) {
    console.error('ListaPlantasDashboard: plantas no es un array:', plantas);
    plantas = [];
  }

  const plantasConEstado = plantas.map(planta => ({
    ...planta,
    estado: 'normal',
    ultimaActualizacion: 'Hace 5 min'
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Plantas del Sistema {plantas.length > 0 && `(${plantas.length})`}
        </h3>
        {plantas.length > 0 && (
          <Link 
            to="/plantas"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todas →
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {plantasConEstado.length > 0 ? (
          plantasConEstado.slice(0, 5).map((planta) => (
            <div key={planta.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  planta.estado === 'normal' ? 'bg-green-500' : 
                  planta.estado === 'alerta' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{planta.nombre}</h4>
                  <p className="text-sm text-gray-500">{planta.ubicacion}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">{planta.ultimaActualizacion}</span>
                <Link
                  to={`/plantas/${planta.id}`}
                  className="block text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏭</div>
            <p>No hay plantas registradas</p>
            <Link 
              to="/plantas" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
            >
              Crear primera planta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}