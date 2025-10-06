import { useState } from 'react';

export default function GraficosDashboard({ datos, plantas, incidencias }) {
  const [tipoGrafico, setTipoGrafico] = useState('rendimiento');

  // Datos simulados para gráficos
  const datosRendimiento = [
    { nombre: 'Planta Principal', eficiencia: 92, nivel: 85 },
    { nombre: 'Planta Norte', eficiencia: 78, nivel: 42 },
    { nombre: 'Tratamiento Norte', eficiencia: 88, nivel: 68 },
    { nombre: 'Depuradora Central', eficiencia: 95, nivel: 90 },
    { nombre: 'Filtración Sur', eficiencia: 82, nivel: 75 }
  ];

  const datosIncidencias = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    pendientes: [2, 3, 1, 4, 2, 1, 0],
    resueltas: [1, 2, 3, 1, 4, 2, 3]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Métricas del Sistema</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTipoGrafico('rendimiento')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              tipoGrafico === 'rendimiento' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rendimiento
          </button>
          <button
            onClick={() => setTipoGrafico('incidencias')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              tipoGrafico === 'incidencias' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Incidencias
          </button>
        </div>
      </div>

      {tipoGrafico === 'rendimiento' ? (
        <div className="space-y-6">
          {/* Gráfico de barras - Eficiencia */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Eficiencia por Planta</h4>
            <div className="space-y-3">
              {datosRendimiento.map((planta, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-32 text-sm text-gray-600 truncate">{planta.nombre}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${planta.eficiencia}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 text-right">
                    {planta.eficiencia}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de niveles */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Niveles de Operación</h4>
            <div className="grid grid-cols-5 gap-2">
              {datosRendimiento.map((planta, index) => (
                <div key={index} className="text-center">
                  <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
                        planta.nivel > 80 ? 'bg-green-400' : 
                        planta.nivel > 60 ? 'bg-blue-400' : 
                        planta.nivel > 40 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ height: `${planta.nivel}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 truncate">
                    {planta.nombre.split(' ')[0]}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {planta.nivel}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Gráfico de líneas - Incidencias */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Incidencias por Día</h4>
            <div className="flex items-end justify-between h-48 px-4">
              {datosIncidencias.labels.map((dia, index) => (
                <div key={dia} className="flex flex-col items-center space-y-2">
                  <div className="flex items-end space-x-1">
                    <div 
                      className="w-6 bg-red-400 rounded-t transition-all duration-500"
                      style={{ height: `${datosIncidencias.pendientes[index] * 20}px` }}
                      title={`${datosIncidencias.pendientes[index]} pendientes`}
                    ></div>
                    <div 
                      className="w-6 bg-green-400 rounded-t transition-all duration-500"
                      style={{ height: `${datosIncidencias.resueltas[index] * 20}px` }}
                      title={`${datosIncidencias.resueltas[index]} resueltas`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{dia}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-xs text-gray-600">Pendientes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-xs text-gray-600">Resueltas</span>
              </div>
            </div>
          </div>

          {/* Resumen de incidencias */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {incidencias.filter(i => i.estado === 'pendiente').length}
                </div>
                <div className="text-sm text-red-700">Pendientes</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {incidencias.filter(i => i.estado === 'en_progreso').length}
                </div>
                <div className="text-sm text-blue-700">En Progreso</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {incidencias.filter(i => i.estado === 'resuelto').length}
                </div>
                <div className="text-sm text-green-700">Resueltas</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}