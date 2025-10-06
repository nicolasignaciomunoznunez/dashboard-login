import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResumenActividad({ incidencias, mantenimientos }) {
  const [tipoActividad, setTipoActividad] = useState('reciente');

  // Combinar y ordenar actividades
  const actividades = [
    ...incidencias.map(incidencia => ({
      id: `inc-${incidencia.id}`,
      tipo: 'incidencia',
      accion: incidencia.estado === 'resuelto' ? 'resuelta' : 'reportada',
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      fecha: new Date(incidencia.fechaReporte),
      estado: incidencia.estado,
      usuario: 'Sistema',
      icono: '⚠️',
      color: incidencia.estado === 'resuelto' ? 'green' : 
             incidencia.estado === 'en_progreso' ? 'blue' : 'yellow'
    })),
    ...mantenimientos.map(mantenimiento => ({
      id: `mant-${mantenimiento.id}`,
      tipo: 'mantenimiento',
      accion: mantenimiento.estado === 'completado' ? 'completado' : 'programado',
      titulo: `Mantenimiento ${mantenimiento.tipo}`,
      descripcion: mantenimiento.descripcion,
      fecha: new Date(mantenimiento.fechaProgramada),
      estado: mantenimiento.estado,
      usuario: 'Técnico',
      icono: '🔧',
      color: mantenimiento.estado === 'completado' ? 'green' : 
             mantenimiento.estado === 'en_progreso' ? 'blue' : 'yellow'
    }))
  ].sort((a, b) => b.fecha - a.fecha).slice(0, 8); // Últimas 8 actividades

  const actividadesFiltradas = tipoActividad === 'todas' 
    ? actividades 
    : tipoActividad === 'incidencias'
    ? actividades.filter(a => a.tipo === 'incidencia')
    : tipoActividad === 'mantenimientos'
    ? actividades.filter(a => a.tipo === 'mantenimiento')
    : actividades;

  const getEstadoColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[color] || colors.yellow;
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const diferencia = ahora - fecha;
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) return `${minutos} min ago`;
    if (horas < 24) return `${horas} h ago`;
    if (dias < 7) return `${dias} d ago`;
    return fecha.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTipoActividad('reciente')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              tipoActividad === 'reciente' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Reciente
          </button>
          <button
            onClick={() => setTipoActividad('incidencias')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              tipoActividad === 'incidencias' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Incidencias
          </button>
          <button
            onClick={() => setTipoActividad('mantenimientos')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              tipoActividad === 'mantenimientos' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mantenimientos
          </button>
        </div>
      </div>

      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600">No hay actividad reciente</p>
          <p className="text-sm text-gray-500">Las actividades aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              {/* Icono */}
              <div className="flex-shrink-0 w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-lg group-hover:border-primary-400 transition-colors">
                {actividad.icono}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                    {actividad.titulo}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatearTiempo(actividad.fecha)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {actividad.descripcion}
                </p>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getEstadoColor(actividad.color)}`}>
                    {actividad.estado}
                  </span>
                  <span className="text-xs text-gray-500">
                    👤 {actividad.usuario}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {actividad.tipo} {actividad.accion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer con enlaces */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Mostrando {actividadesFiltradas.length} actividades
          </span>
          <div className="flex space-x-3">
            <Link
              to="/incidencias"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas las incidencias →
            </Link>
            <Link
              to="/mantenimientos"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver mantenimientos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}