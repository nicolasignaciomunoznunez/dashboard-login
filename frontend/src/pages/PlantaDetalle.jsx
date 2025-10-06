import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlantasStore } from '../stores/plantasStore';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useAuthStore } from '../stores/authStore'; // ✅ AGREGAR ESTE IMPORT
import { datosPlantaService } from '../services/datosPlantaService';
import ModalIncidencia from '../components/incidencias/ModalIncidencia';
import ListaMantenimientos from '../components/mantenimiento/ListaMantenimientos'; // ✅ AGREGAR

export default function PlantaDetalle() {
  const { id } = useParams();
  const { plantaSeleccionada, obtenerPlanta, loading } = usePlantasStore();
  const { incidencias, obtenerIncidenciasPlanta } = useIncidenciasStore();
  const { user } = useAuthStore(); // ✅ AGREGAR ESTA LÍNEA
  const [datosPlanta, setDatosPlanta] = useState([]);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [showModalIncidencia, setShowModalIncidencia] = useState(false);
  const [errorDatos, setErrorDatos] = useState(null);
  const [cargado, setCargado] = useState(false);

  // ✅ SOLUCIÓN: Usar un flag para cargar solo una vez
  useEffect(() => {
    if (!id || cargado) return;

    const cargarTodo = async () => {
      try {
        console.log('🔄 Cargando datos de planta...');
        await obtenerPlanta(id);
        await obtenerIncidenciasPlanta(id);
        
        try {
          const response = await datosPlantaService.obtenerDatosPlanta(id, 50);
          setDatosPlanta(response.datos || []);
        } catch (error) {
          console.warn('⚠️ Datos operativos no disponibles');
          setErrorDatos('Datos operativos temporalmente no disponibles');
        }
      } catch (error) {
        console.error('Error general:', error);
      } finally {
        setLoadingDatos(false);
        setCargado(true);
      }
    };

    cargarTodo();
  }, [id, cargado]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!plantaSeleccionada) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Planta no encontrada</h2>
          <p className="text-yellow-700 mb-4">La planta que buscas no existe o no tienes acceso.</p>
          <Link to="/plantas" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Volver a la lista de plantas
          </Link>
        </div>
      </div>
    );
  }

  // Calcular métricas actuales
  const ultimoDato = datosPlanta[0] || {};
  const metricas = [
    { label: 'Nivel del Estanque', value: `${ultimoDato.nivelLocal || 0}%`, icon: '💧', color: 'blue' },
    { label: 'Presión', value: `${ultimoDato.presion || 0} psi`, icon: '📊', color: 'green' },
    { label: 'Turbidez', value: `${ultimoDato.turbidez || 0} NTU`, icon: '🌊', color: 'orange' },
    { label: 'Nivel de Cloro', value: `${ultimoDato.cloro || 0} ppm`, icon: '🧪', color: 'purple' },
    { label: 'Consumo Energético', value: `${ultimoDato.energia || 0} kWh`, icon: '⚡', color: 'yellow' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              to="/plantas" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Plantas
            </Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900">{plantaSeleccionada.nombre}</h1>
          </div>
          <p className="text-gray-600">{plantaSeleccionada.ubicacion}</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
            Reportar Incidencia
          </button>
        </div>
      </div>

      {/* Métricas Actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricas.map((metrica, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metrica.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrica.value}</p>
              </div>
              <div className="text-2xl opacity-70">
                {metrica.icon}
              </div>
            </div>
            {ultimoDato.timestamp && (
              <p className="text-xs text-gray-500 mt-2">
                Actualizado: {new Date(ultimoDato.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Información de la Planta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className="text-gray-900">{plantaSeleccionada.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ubicación</label>
              <p className="text-gray-900">{plantaSeleccionada.ubicacion}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Cliente</label>
              <p className="text-gray-900">{plantaSeleccionada.clienteNombre || 'No asignado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-gray-900">{plantaSeleccionada.id}</p>
            </div>
          </div>
        </div>

        {/* Últimos Datos */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Reciente</h3>
          {errorDatos ? (
            <div className="text-center py-8 text-yellow-600 bg-yellow-50 rounded-lg">
              <div className="text-4xl mb-2">⚠️</div>
              <p>{errorDatos}</p>
              <p className="text-sm mt-2">El servidor de datos no está respondiendo</p>
            </div>
          ) : loadingDatos ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : datosPlanta.length > 0 ? (
            <div className="space-y-3">
              {datosPlanta.slice(0, 10).map((dato, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      dato.nivelLocal > 70 ? 'bg-green-500' : 
                      dato.nivelLocal > 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{dato.nivelLocal}% nivel</p>
                      <p className="text-sm text-gray-500">
                        {new Date(dato.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {dato.presion} psi • {dato.turbidez} NTU
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No hay datos registrados para esta planta</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Mantenimientos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ListaMantenimientos 
          plantaId={plantaSeleccionada?.id} 
          soloLectura={user?.rol === 'cliente'} // ✅ AHORA user está definido
        />
      </div>

      {/* Sección de Incidencias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Incidencias Recientes</h3>
          <button 
            onClick={() => setShowModalIncidencia(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            + Reportar
          </button>
        </div>
        {incidencias.length > 0 ? (
          <div className="space-y-3">
            {incidencias.slice(0, 5).map((incidencia) => (
              <div key={incidencia.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    incidencia.estado === 'pendiente' ? 'bg-yellow-500' : 
                    incidencia.estado === 'en_progreso' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{incidencia.titulo}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(incidencia.fechaReporte).toLocaleDateString()} • 
                      Estado: {incidencia.estado}
                    </p>
                  </div>
                </div>
                <Link
                  to="/incidencias"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⚠️</div>
            <p>No hay incidencias reportadas</p>
          </div>
        )}
      </div>

      {/* Modal de Incidencias */}
      <ModalIncidencia
        isOpen={showModalIncidencia}
        onClose={() => setShowModalIncidencia(false)}
        incidencia={null}
        plantaPreSeleccionada={plantaSeleccionada?.id}
      />
    </div>
  );
}