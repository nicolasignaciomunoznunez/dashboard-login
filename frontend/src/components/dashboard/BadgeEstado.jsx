// components/dashboard/BadgeEstado.jsx
export default function BadgeEstado({ estado }) {
  const config = {
    pendiente: { 
      clase: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      texto: 'Pendiente',
      icono: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    en_progreso: { 
      clase: 'bg-blue-100 text-blue-800 border-blue-200', 
      texto: 'En Progreso',
      icono: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    resuelto: { 
      clase: 'bg-green-100 text-green-800 border-green-200', 
      texto: 'Resuelto',
      icono: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    completado: { 
      clase: 'bg-green-100 text-green-800 border-green-200', 
      texto: 'Completado',
      icono: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  };

  const { clase, texto, icono } = config[estado] || { 
    clase: 'bg-gray-100 text-gray-800 border-gray-200', 
    texto: estado.charAt(0).toUpperCase() + estado.slice(1),
    icono: '⚪'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${clase}`}>
      {icono}
      {texto}
    </span>
  );
}