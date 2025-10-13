import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado';

export default function ResumenActividad({ incidencias, mantenimientos }) {
  const [tipoActividad, setTipoActividad] = useState('reciente');

  // ✅ ACTIVIDADES OPTIMIZADAS CON USEMEMO
  const actividadesOptimizadas = useMemo(() => {
    const mapearActividad = (item, tipo) => {
      const esIncidencia = tipo === 'incidencia';
      
      // ✅ USAR FECHA CORRECTA Y MANEJAR FUTURO
      let fecha;
      if (esIncidencia) {
        fecha = new Date(item.fechaReporte);
      } else {
        fecha = new Date(item.fechaProgramada);
        // Para mantenimientos, si la fecha es futura, usar fecha de creación
        if (fecha > new Date() && item.createdAt) {
          fecha = new Date(item.createdAt);
        }
      }
      
      // ✅ ESTADOS SIMPLIFICADOS
      let estado = item.estado;
      let color = 'gray';
      
      if (estado === 'resuelto' || estado === 'completado') color = 'green';
      else if (estado === 'en_progreso') color = 'blue';
      else if (estado === 'pendiente') color = 'yellow';
      
      return {
        id: `${tipo}-${item.id}`,
        tipo,
        titulo: esIncidencia ? item.titulo : `Mantenimiento ${item.tipo}`,
        descripcion: item.descripcion,
        fecha,
        estado,
        color,
        icono: esIncidencia ? '⚠️' : '🔧',
        usuario: item.userId ? `Usuario ${item.userId}` : 'Sistema'
      };
    };

    return [
      ...incidencias.map(inc => mapearActividad(inc, 'incidencia')),
      ...mantenimientos.map(mant => mapearActividad(mant, 'mantenimiento'))
    ]
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 6);
  }, [incidencias, mantenimientos]);

  // ✅ FILTRADO MEMOIZADO
  const actividadesFiltradas = useMemo(() => {
    if (tipoActividad === 'todas') return actividadesOptimizadas;
    if (tipoActividad === 'incidencias') 
      return actividadesOptimizadas.filter(a => a.tipo === 'incidencia');
    if (tipoActividad === 'mantenimientos') 
      return actividadesOptimizadas.filter(a => a.tipo === 'mantenimiento');
    return actividadesOptimizadas;
  }, [tipoActividad, actividadesOptimizadas]);


  // ✅ FORMATO TIEMPO CORREGIDO (SIN NEGATIVOS)
  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const diffMs = Math.abs(ahora - fecha); // ✅ MATH.ABS PARA EVITAR NEGATIVOS
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // ✅ DIFERENCIAR ENTRE PASADO Y FUTURO
    const esFuturo = fecha > ahora;
    const prefijo = esFuturo ? 'En ' : 'Hace ';

    if (diffMins < 60) return `${prefijo}${diffMins} min`;
    if (diffHours < 24) return `${prefijo}${diffHours} h`;
    if (diffDays < 7) return `${prefijo}${diffDays} d`;
    
    // ✅ PARA FECHAS LEJANAS, MOSTRAR FECHA COMPLETA
    if (esFuturo) {
      return `Programado: ${fecha.toLocaleDateString('es-ES')}`;
    }
    return fecha.toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        
        {/* ✅ FILTROS MÁS COMPACTOS */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['reciente', 'incidencias', 'mantenimientos'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoActividad(tipo)}
              className={`px-3 py-1 text-xs rounded-md transition-colors capitalize ${
                tipoActividad === tipo 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ LISTA OPTIMIZADA */}
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600">No hay actividad reciente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-sm group-hover:border-blue-400 transition-colors">
                {actividad.icono}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1 text-sm">
                    {actividad.titulo}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatearTiempo(actividad.fecha)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {actividad.descripcion}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                 <BadgeEstado estado={actividad.estado} />
                  <span className="text-xs text-gray-500 capitalize">
                    {actividad.tipo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FOOTER COMPACTO */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {actividadesFiltradas.length} actividades
          </span>
          <div className="flex gap-4">
            <Link to="/incidencias" className="text-blue-600 hover:text-blue-700 font-medium">
              Incidencias →
            </Link>
            <Link to="/mantenimientos" className="text-blue-600 hover:text-blue-700 font-medium">
              Mantenimientos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}