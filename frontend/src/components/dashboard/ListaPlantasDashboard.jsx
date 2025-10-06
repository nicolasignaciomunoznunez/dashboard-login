import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ListaPlantasDashboard({ plantas }) {
  const [plantaExpandida, setPlantaExpandida] = useState(null);

  // Datos simulados de métricas para cada planta
  const getMetricasPlanta = (plantaId) => {
    const metricasBase = {
      nivel: Math.floor(Math.random() * 100),
      presion: (Math.random() * 100).toFixed(1),
      turbidez: (Math.random() * 5).toFixed(1),
      cloro: (Math.random() * 3).toFixed(1),
      estado: Math.random() > 0.7 ? 'critico' : Math.random() > 0.3 ? 'estable' : 'optimal',
      ultimaActualizacion: new Date(Date.now() - Math.random() * 86400000) // Últimas 24h
    };

    return metricasBase;
  };

  const getColorEstado = (estado) => {
    const colores = {
      optimal: 'bg-green-100 text-green-800 border-green-200',
      estable: 'bg-blue-100 text-blue-800 border-blue-200',
      critico: 'bg-red-100 text-red-800 border-red-200'
    };
    return colores[estado] || colores.estable;
  };

  const getIconoEstado = (estado) => {
    const iconos = {
      optimal: '✅',
      estable: '⚠️',
      critico: '🔴'
    };
    return iconos[estado] || '⚪';
  };

  const toggleExpandir = (plantaId) => {
    setPlantaExpandida(plantaExpandida === plantaId ? null : plantaId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Plantas Activas</h3>
        <Link
          to="/plantas"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver todas →
        </Link>
      </div>

      {plantas.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🏭</div>
          <p className="text-gray-600">No hay plantas registradas</p>
          <p className="text-sm text-gray-500">Agrega la primera planta al sistema</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plantas.slice(0, 5).map((planta) => {
            const metricas = getMetricasPlanta(planta.id);
            const estaExpandida = plantaExpandida === planta.id;

            return (
              <div
                key={planta.id}
                className="border border-gray-200 rounded-lg hover:border-primary-300 transition-all duration-200"
              >
                {/* Header de la planta */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpandir(planta.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {planta.nombre.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{planta.nombre}</h4>
                        <p className="text-sm text-gray-500">{planta.ubicacion}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getColorEstado(metricas.estado)}`}>
                        {getIconoEstado(metricas.estado)} {metricas.estado}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        metricas.estado === 'optimal' ? 'bg-green-400' :
                        metricas.estado === 'estable' ? 'bg-blue-400' : 'bg-red-400'
                      }`}></div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        {estaExpandida ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                {estaExpandida && (
                  <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                    {/* Métricas rápidas */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{metricas.nivel}%</div>
                        <div className="text-xs text-gray-600">Nivel</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{metricas.presion}</div>
                        <div className="text-xs text-gray-600">Presión</div>
                      </div>
                    </div>

                    {/* Barra de progreso del nivel */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Nivel de operación</span>
                        <span>{metricas.nivel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metricas.nivel > 80 ? 'bg-green-500' :
                            metricas.nivel > 60 ? 'bg-blue-500' :
                            metricas.nivel > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metricas.nivel}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/plantas/${planta.id}`}
                        className="flex-1 text-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Ver Detalles
                      </Link>
                      <Link
                        to="/incidencias"
                        className="flex-1 text-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reportar Problema
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen */}
      {plantas.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {plantas.filter(p => getMetricasPlanta(p.id).estado === 'optimal').length}
              </div>
              <div className="text-xs text-gray-600">Óptimas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {plantas.filter(p => getMetricasPlanta(p.id).estado === 'estable').length}
              </div>
              <div className="text-xs text-gray-600">Estables</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {plantas.filter(p => getMetricasPlanta(p.id).estado === 'critico').length}
              </div>
              <div className="text-xs text-gray-600">Críticas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}