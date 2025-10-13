// components/dashboard/BadgeTipo.jsx
export default function BadgeTipo({ tipo }) {
  const config = {
    preventivo: { 
      clase: 'bg-purple-50 text-purple-700 border-purple-200', 
      texto: 'Preventivo',
      icono: '🛡️'
    },
    correctivo: { 
      clase: 'bg-orange-50 text-orange-700 border-orange-200', 
      texto: 'Correctivo',
      icono: '🔧'
    }
  };

  const { clase, texto, icono } = config[tipo] || { 
    clase: 'bg-gray-100 text-gray-800 border-gray-200', 
    texto: tipo,
    icono: '⚪'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${clase}`}>
      {icono}
      {texto}
    </span>
  );
}