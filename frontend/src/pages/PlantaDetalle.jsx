import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlantasStore } from '../stores/plantasStore';
import { useIncidenciasStore } from '../stores/incidenciasStore';
import { useAuthStore } from '../stores/authStore';
import { datosPlantaService } from '../services/datosPlantaService';
import ModalIncidencia from '../components/incidencias/ModalIncidencia';
import ListaMantenimientos from '../components/mantenimiento/ListaMantenimientos';

export default function PlantaDetalle() {
  const { id } = useParams();
  const { plantaSeleccionada, obtenerPlanta, loading } = usePlantasStore();
  const { incidencias, obtenerIncidenciasPlanta } = useIncidenciasStore();
  const { user } = useAuthStore();
  const [datosPlanta, setDatosPlanta] = useState([]);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [showModalIncidencia, setShowModalIncidencia] = useState(false);
  const [errorDatos, setErrorDatos] = useState(null);
  const [cargado, setCargado] = useState(false);

  console.log('🔍 [PlantaDetalle] ID extraído:', id);

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
          
          {/* Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm h-64"></div>
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plantaSeleccionada) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Planta no encontrada</h2>
          <p className="text-gray-600 mb-6">La planta que buscas no existe o no tienes acceso.</p>
          <Link 
            to="/plantas" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la lista de plantas
          </Link>
        </div>
      </div>
    );
  }

  // Calcular métricas actuales
  const ultimoDato = datosPlanta[0] || {};
  const metricas = [
    { 
      label: 'Nivel del Estanque', 
      value: `${ultimoDato.nivelLocal || 0}%`, 
      icon: '💧', 
      color: 'blue',
      status: ultimoDato.nivelLocal > 70 ? 'high' : ultimoDato.nivelLocal > 30 ? 'medium' : 'low'
    },
    { 
      label: 'Presión', 
      value: `${ultimoDato.presion || 0} psi`, 
      icon: '📊', 
      color: 'green',
      status: 'normal'
    },
    { 
      label: 'Turbidez', 
      value: `${ultimoDato.turbidez || 0} NTU`, 
      icon: '🌊', 
      color: 'orange',
      status: 'normal'
    },
    { 
      label: 'Nivel de Cloro', 
      value: `${ultimoDato.cloro || 0} ppm`, 
      icon: '🧪', 
      color: 'purple',
      status: 'normal'
    },
    { 
      label: 'Consumo Energético', 
      value: `${ultimoDato.energia || 0} kWh`, 
      icon: '⚡', 
      color: 'yellow',
      status: 'normal'
    }
  ];

  // Calcular estadísticas rápidas
  const incidenciasActivas = incidencias.filter(i => i.estado !== 'resuelto').length;
  const estadoGeneral = incidenciasActivas === 0 ? 'optimal' : 'warning';

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link 
              to="/plantas" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              ← Volver a plantas
            </Link>
            <span>/</span>
            <span>Detalle de planta</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {plantaSeleccionada.nombre}
            </h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              estadoGeneral === 'optimal' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {estadoGeneral === 'optimal' ? '✅ Operativa' : '⚠️ Con incidencias'}
            </div>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {plantaSeleccionada.ubicacion}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModalIncidencia(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Reportar Incidencia
          </button>
        </div>
      </div>

      {/* Métricas Actuales Mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricas.map((metrica, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl opacity-70">
                {metrica.icon}
              </div>
              {metrica.status === 'high' && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
              {metrica.status === 'medium' && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              )}
              {metrica.status === 'low' && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metrica.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metrica.value}</p>
            </div>
            {ultimoDato.timestamp && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(ultimoDato.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Información de la Planta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General Mejorada */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información General
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Nombre</span>
              <span className="text-gray-900 font-medium">{plantaSeleccionada.nombre}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Ubicación</span>
              <span className="text-gray-900 font-medium">{plantaSeleccionada.ubicacion}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Cliente</span>
              <span className="text-gray-900 font-medium">{plantaSeleccionada.clienteNombre || 'No asignado'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">ID</span>
              <span className="text-gray-900 font-mono text-sm">{plantaSeleccionada.id}</span>
            </div>
          </div>
        </div>

        {/* Últimos Datos Mejorados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Historial Reciente
            </h3>
            {datosPlanta.length > 0 && (
              <span className="text-sm text-gray-500">
                {datosPlanta.length} registros
              </span>
            )}
          </div>
          
          {errorDatos ? (
            <div className="text-center py-8 bg-yellow-50 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-yellow-800 font-medium">{errorDatos}</p>
              <p className="text-sm text-yellow-600 mt-1">El servidor de datos no está respondiendo</p>
            </div>
          ) : loadingDatos ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : datosPlanta.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {datosPlanta.slice(0, 10).map((dato, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center gap-4">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Cloro: {dato.cloro} ppm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600">No hay datos registrados para esta planta</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Mantenimientos Mejorada */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <ListaMantenimientos 
          plantaId={plantaSeleccionada?.id} 
          soloLectura={user?.rol === 'cliente'}
        />
      </div>

      {/* Sección de Incidencias Mejorada */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Incidencias Recientes
          </h3>
          <div className="flex items-center gap-3">
            {incidenciasActivas > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {incidenciasActivas} activa(s)
              </span>
            )}
            <button 
              onClick={() => setShowModalIncidencia(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Reportar
            </button>
          </div>
        </div>
        
        {incidencias.length > 0 ? (
          <div className="space-y-3">
            {incidencias.slice(0, 5).map((incidencia) => (
              <div key={incidencia.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    incidencia.estado === 'pendiente' ? 'bg-yellow-500' : 
                    incidencia.estado === 'en_progreso' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{incidencia.titulo}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(incidencia.fechaReporte).toLocaleDateString()} • 
                      <span className="capitalize"> {incidencia.estado.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard/incidencias"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  Ver detalles →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">No hay incidencias reportadas</p>
            <p className="text-sm text-gray-500 mt-1">Todas las operaciones están normales</p>
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