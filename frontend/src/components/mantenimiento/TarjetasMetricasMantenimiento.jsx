// components/mantenimiento/TarjetasMetricasMantenimiento.jsx
import { useMemo } from 'react';

export default function TarjetasMetricasMantenimiento({ metricas }) {
  // ✅ OPTIMIZACIÓN: useMemo para evitar recreación en cada render
  const tarjetas = useMemo(() => [
    {
      titulo: 'Total Mantenimientos',
      valor: metricas?.total || 0,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'blue',
      descripcion: 'Mantenimientos programados',
      esCritico: false
    },
    {
      titulo: 'Pendientes',
      valor: metricas?.pendientes || 0,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
      descripcion: 'Por iniciar',
      esCritico: metricas?.pendientes > 5 // ✅ ALERTA SI HAY MUCHOS PENDIENTES
    },
    {
      titulo: 'En Progreso',
      valor: metricas?.enProgreso || 0,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'orange',
      descripcion: 'En ejecución',
      esCritico: false
    },
    {
      titulo: 'Próximos a Vencer',
      valor: metricas?.proximosVencimientos || 0,
      icono: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red',
      descripcion: 'En los próximos 7 días',
      esCritico: metricas?.proximosVencimientos > 0 // ✅ SIEMPRE CRÍTICO
    }
  ], [metricas]); // ✅ DEPENDENCIA: solo se recalcula si metricas cambia

  // ✅ OPTIMIZACIÓN: useMemo para colores también
  const getColorClasses = useMemo(() => (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        accent: 'bg-blue-500',
        icon: 'text-blue-600',
        critico: 'border-blue-300 ring-2 ring-blue-100' // ✅ EFECTO PARA CRÍTICO
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        accent: 'bg-yellow-500',
        icon: 'text-yellow-600',
        critico: 'border-yellow-300 ring-2 ring-yellow-100'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        accent: 'bg-orange-500',
        icon: 'text-orange-600',
        critico: 'border-orange-300 ring-2 ring-orange-100'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        accent: 'bg-red-500',
        icon: 'text-red-600',
        critico: 'border-red-300 ring-2 ring-red-100'
      }
    };
    return colors[color] || colors.blue;
  }, []);

  // ✅ CALCULAR PORCENTAJE MÁS INTELIGENTE
  const calcularPorcentaje = (tarjeta) => {
    if (tarjeta.titulo === 'Total Mantenimientos') return 100;
    if (tarjeta.titulo === 'Próximos a Vencer') {
      return Math.min((tarjeta.valor / Math.max(metricas?.pendientes || 1, 1)) * 100, 100);
    }
    return Math.min((tarjeta.valor / Math.max(metricas?.total || 1, 1)) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tarjetas.map((tarjeta, index) => {
        const colors = getColorClasses(tarjeta.color);
        const porcentaje = calcularPorcentaje(tarjeta);
        
        return (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${colors.border} ${
              tarjeta.esCritico ? colors.critico : ''
            } hover:shadow-md transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-600">{tarjeta.titulo}</p>
                  {tarjeta.esCritico && (
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{tarjeta.valor}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.accent}`}></div>
                  <p className="text-sm text-gray-500">{tarjeta.descripcion}</p>
                </div>
              </div>
              <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <div className={colors.icon}>
                  {tarjeta.icono}
                </div>
              </div>
            </div>
            
            {/* Barra de progreso mejorada */}
            <div className="mt-4 w-full bg-gray-100 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${colors.accent} transition-all duration-1000 ease-out`}
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>

            {/* ✅ INDICADOR DE PORCENTAJE (opcional) */}
            {tarjeta.titulo !== 'Total Mantenimientos' && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Progreso</span>
                <span>{Math.round(porcentaje)}%</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}