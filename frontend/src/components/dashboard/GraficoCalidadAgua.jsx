import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GraficoCalidadAgua({ datos }) {
  // Preparar datos para el gráfico de calidad
  const datosGrafico = datos.map(item => ({
    nombre: item.plantaNombre || `Planta ${item.plantId}`,
    turbidez: item.turbidez || 0,
    cloro: item.cloro || 0,
    presion: item.presion || 0
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Calidad del Agua por Planta
      </h3>
      <div className="h-80">
        {datosGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="turbidez" 
                stroke="#8B5CF6" 
                name="Turbidez (NTU)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="cloro" 
                stroke="#10B981" 
                name="Cloro (ppm)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="presion" 
                stroke="#3B82F6" 
                name="Presión (psi)"
                strokeWidth={2}
              />
            </LineChart>
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