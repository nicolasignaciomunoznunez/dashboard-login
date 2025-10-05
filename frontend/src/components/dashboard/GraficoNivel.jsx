import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GraficoNivel({ datos }) {
  // Preparar datos para el gráfico
  const datosGrafico = datos.map(item => ({
    nombre: item.plantaNombre || `Planta ${item.plantId}`,
    nivel: item.nivelLocal || 0,
    estado: item.nivelLocal > 70 ? 'Alto' : item.nivelLocal > 30 ? 'Medio' : 'Bajo'
  }));

  const colores = {
    'Alto': '#10B981', // verde
    'Medio': '#F59E0B', // amarillo
    'Bajo': '#EF4444' // rojo
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Nivel de Estanque por Planta
      </h3>
      <div className="h-80">
        {datosGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                label={{ 
                  value: 'Nivel (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fontSize: 12
                }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Nivel']}
                labelFormatter={(label) => `Planta: ${label}`}
              />
              <Bar dataKey="nivel" name="Nivel">
                {datosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colores[entry.estado]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
}