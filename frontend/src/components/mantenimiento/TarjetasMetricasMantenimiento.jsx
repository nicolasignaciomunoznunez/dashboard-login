// components/mantenimiento/TarjetasMetricasMantenimiento.jsx
export default function TarjetasMetricasMantenimiento({ metricas }) {
  const tarjetas = [
    {
      titulo: 'Total Mantenimientos',
      valor: metricas.total,
      icono: '🔧',
      color: 'blue',
      descripcion: 'Mantenimientos totales'
    },
    {
      titulo: 'Pendientes',
      valor: metricas.pendientes,
      icono: '⏳',
      color: 'yellow',
      descripcion: 'Por iniciar'
    },
    {
      titulo: 'En Progreso',
      valor: metricas.enProgreso,
      icono: '🔄',
      color: 'orange',
      descripcion: 'En ejecución'
    },
    {
      titulo: 'Próximos a Vencer',
      valor: metricas.proximosVencimientos,
      icono: '⚠️',
      color: 'red',
      descripcion: 'En los próximos 7 días'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tarjetas.map((tarjeta, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg border-2 ${getColorClasses(tarjeta.color)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{tarjeta.titulo}</p>
              <p className="text-3xl font-bold mt-2">{tarjeta.valor}</p>
              <p className="text-sm opacity-75 mt-1">{tarjeta.descripcion}</p>
            </div>
            <div className="text-3xl">{tarjeta.icono}</div>
          </div>
        </div>
      ))}
    </div>
  );
}