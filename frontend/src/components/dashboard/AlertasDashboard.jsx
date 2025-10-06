import { useState } from 'react';

export default function AlertasDashboard({ plantas, incidencias, mantenimientos }) {
  const [filtroAlerta, setFiltroAlerta] = useState('todas');

  // Generar alertas basadas en datos reales
  const alertas = [
    ...incidencias.filter(i => i.estado === 'pendiente').slice(0, 3).map(incidencia => ({
      id: `inc-${incidencia.id}`,
      tipo: 'incidencia',
      nivel: 'alta',
      titulo: `Incidencia pendiente: ${incidencia.titulo}`,
      descripcion: incidencia.descripcion?.substring(0, 100) + '...',
      fecha: new Date(incidencia.fechaReporte),
      planta: plantas.find(p => p.id === incidencia.plantId)?.nombre || 'Planta desconocida'
    })),
    ...mantenimientos.filter(m => {
      const fechaProgramada = new Date(m.fechaProgramada);
      const hoy = new Date();
      const diferenciaDias = (fechaProgramada - hoy) / (1000 * 60 * 60 * 24);
      return diferenciaDias <= 2 && m.estado === 'pendiente';
    }).slice(0, 2).map(mantenimiento => ({
      id: `mant-${mantenimiento.id}`,
      tipo: 'mantenimiento',
      nivel: 'media',
      titulo: `Mantenimiento próximo`,
      descripcion: `Programado para ${new Date(mantenimiento.fechaProgramada).toLocaleDateString()}`,
      fecha: new Date(mantenimiento.fechaProgramada),
      planta: plantas.find(p => p.id === mantenimiento.plantId)?.nombre || 'Planta desconocida'
    })),
    // Alertas de sistema
    {
      id: 'sistema-1',
      tipo: 'sistema',
      nivel: 'baja',
      titulo: 'Actualización disponible',
      descripcion: 'Nueva versión del sistema lista para instalar',
      fecha: new Date(),
      planta: 'Sistema'
    }
  ];

  const alertasFiltradas = filtroAlerta === 'todas' 
    ? alertas 
    : alertas.filter(alerta => alerta.nivel === filtroAlerta);

  const getNivelColor = (nivel) => {
    const colores = {
      alta: 'bg-red-100 text-red-800 border-red-200',
      media: 'bg-orange-100 text-orange-800 border-orange-200',
      baja: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colores[nivel] || colores.baja;
  };

  const getIcono = (tipo) => {
    const iconos = {
      incidencia: '⚠️',
      mantenimiento: '🔧',
      sistema: '🔄'
    };
    return iconos[tipo] || '📢';
  };

  if (alertas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas del Sistema</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-gray-600">No hay alertas activas</p>
          <p className="text-sm text-gray-500">Todo funciona correctamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h3>
        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
          {alertas.length} activas
        </span>
      </div>

      {/* Filtros de alertas */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFiltroAlerta('todas')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filtroAlerta === 'todas' 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltroAlerta('alta')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filtroAlerta === 'alta' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Alta
        </button>
        <button
          onClick={() => setFiltroAlerta('media')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filtroAlerta === 'media' 
              ? 'bg-orange-100 text-orange-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Media
        </button>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alertasFiltradas.map((alerta) => (
          <div
            key={alerta.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${getNivelColor(alerta.nivel)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-xl mt-1">{getIcono(alerta.tipo)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{alerta.titulo}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    alerta.nivel === 'alta' ? 'bg-red-200 text-red-800' :
                    alerta.nivel === 'media' ? 'bg-orange-200 text-orange-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {alerta.nivel}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2 line-clamp-2">{alerta.descripcion}</p>
                <div className="flex justify-between items-center text-xs opacity-75">
                  <span>📌 {alerta.planta}</span>
                  <span>{alerta.fecha.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alertasFiltradas.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No hay alertas de este tipo
        </div>
      )}
    </div>
  );
}