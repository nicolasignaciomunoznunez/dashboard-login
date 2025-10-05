export default function TarjetasMetricas({ metricas, plantas = [], datosLocales = [] }) {
  // Usar plantas.length para el total
  const totalPlantas = plantas.length;
  const plantasActivas = datosLocales.length;
  const incidenciasActivas = 2;
  const eficienciaPromedio = datosLocales.length > 0 
    ? (datosLocales.reduce((acc, d) => acc + (d.nivelLocal || 0), 0) / datosLocales.length).toFixed(1)
    : 0;

  const tarjetas = [
    {
      titulo: 'Plantas Totales',
      valor: totalPlantas,
      icono: '🏭',
      color: 'blue',
      descripcion: `${plantas.length} plantas en sistema`
    },
    {
      titulo: 'Plantas Activas',
      valor: plantasActivas,
      icono: '✅',
      color: 'green',
      descripcion: 'Con datos recientes'
    },
    {
      titulo: 'Incidencias',
      valor: incidenciasActivas,
      icono: '⚠️',
      color: 'orange',
      descripcion: 'Reportes pendientes'
    },
    {
      titulo: 'Eficiencia',
      valor: `${eficienciaPromedio}%`,
      icono: '📊',
      color: 'purple',
      descripcion: 'Nivel promedio'
    }
  ];

  const colores = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tarjetas.map((tarjeta, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg border-2 p-6 ${colores[tarjeta.color]}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{tarjeta.titulo}</p>
              <p className="text-3xl font-bold mt-2">{tarjeta.valor}</p>
              <p className="text-xs opacity-75 mt-1">{tarjeta.descripcion}</p>
            </div>
            <div className="text-3xl opacity-75">
              {tarjeta.icono}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}