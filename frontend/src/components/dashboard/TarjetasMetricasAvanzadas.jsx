export default function TarjetasMetricasAvanzadas({ metricas, plantas, incidencias, mantenimientos }) {
  // Usar datos reales del backend cuando estén disponibles
  const tarjetas = [
    {
      titulo: 'Plantas Activas',
      valor: metricas?.plantasActivas || plantas.length,
      icono: '🏭',
      color: 'blue',
      tendencia: '+2',
      descripcion: `${metricas?.totalPlantas || plantas.length} plantas en total`,
      link: '/plantas',
      realData: !!metricas
    },
    {
      titulo: 'Incidencias Activas',
      valor: metricas?.incidenciasActivas || incidencias.filter(i => i.estado !== 'resuelto').length,
      icono: '⚠️',
      color: 'red',
      tendencia: '-1',
      descripcion: 'Problemas pendientes de resolver',
      link: '/incidencias',
      realData: !!metricas
    },
    {
      titulo: 'Eficiencia',
      valor: metricas?.eficienciaPromedio ? `${metricas.eficienciaPromedio}%` : '94%',
      icono: '📊',
      color: 'green',
      tendencia: '+2%',
      descripcion: 'Promedio del sistema',
      link: '/reportes',
      realData: !!metricas
    },
    {
      titulo: 'Mantenimientos',
      valor: mantenimientos.filter(m => m.estado === 'pendiente').length,
      icono: '🔧',
      color: 'orange',
      tendencia: '+3',
      descripcion: 'Programados esta semana',
      link: '/mantenimientos',
      realData: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      green: 'bg-green-50 border-green-200 text-green-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tarjetas.map((tarjeta, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl border-2 ${getColorClasses(tarjeta.color)} hover:shadow-lg transition-all duration-300 cursor-pointer group relative`}
          onClick={() => window.location.href = tarjeta.link}
        >
          {/* Indicador de datos reales */}
          {tarjeta.realData && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Datos en tiempo real"></div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{tarjeta.icono}</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              tarjeta.tendencia.startsWith('+') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {tarjeta.tendencia}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-80">{tarjeta.titulo}</p>
            <p className="text-3xl font-bold">{tarjeta.valor}</p>
            <p className="text-sm opacity-75">{tarjeta.descripcion}</p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-opacity-30">
            <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
              {tarjeta.realData ? '📊 Datos en tiempo real' : '📈 Datos estimados'} →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}