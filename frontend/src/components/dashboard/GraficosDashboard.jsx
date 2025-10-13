import { useState, useMemo } from 'react';

export default function GraficosDashboard({ datos, plantas, incidencias, metricasReales }) {

 console.log('🔍 DEBUG - Datos recibidos en GraficosDashboard:', {
    datosRendimientoReales: datos?.plantas || [],
    metricasReales, 
    plantas,
    incidenciasCount: incidencias.length
  });

  const [tipoGrafico, setTipoGrafico] = useState('rendimiento');

  // ✅ USAR DATOS REALES - eliminar datos simulados
  const datosRendimientoReales = datos?.plantas || [];

  // ✅ GENERAR DATOS REALES DE INCIDENCIAS POR DÍA
  const datosIncidenciasReales = useMemo(() => {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // Obtener fecha de hace 7 días
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
    
    // Filtrar incidencias de la última semana
    const incidenciasRecientes = incidencias.filter(incidencia => 
      new Date(incidencia.fechaReporte) >= unaSemanaAtras
    );
    
    // Inicializar arrays para cada día
    const pendientesPorDia = Array(7).fill(0);
    const resueltasPorDia = Array(7).fill(0);
    
    // Agrupar incidencias por día de la semana
    incidenciasRecientes.forEach(incidencia => {
      const fecha = new Date(incidencia.fechaReporte);
      const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes...
      
      // Ajustar para que Lunes=0, Domingo=6
      const index = diaSemana === 0 ? 6 : diaSemana - 1;
      
      if (incidencia.estado === 'pendiente' || incidencia.estado === 'en_progreso') {
        pendientesPorDia[index]++;
      } else if (incidencia.estado === 'resuelto') {
        resueltasPorDia[index]++;
      }
    });
    
    return {
      labels: dias,
      pendientes: pendientesPorDia,
      resueltas: resueltasPorDia
    };
  }, [incidencias]);

  // ✅ CALCULAR ALTURA MÁXIMA DINÁMICA para el gráfico
  const maxIncidencias = useMemo(() => {
    const todosLosValores = [
      ...datosIncidenciasReales.pendientes,
      ...datosIncidenciasReales.resueltas
    ];
    return Math.max(...todosLosValores, 1); // Mínimo 1 para evitar división por 0
  }, [datosIncidenciasReales]);

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    switch(estado) {
      case 'optimal': return 'Óptimo';
      case 'stable': return 'Estable';
      case 'attention': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Sin datos';
    }
  };

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'optimal': return 'bg-green-500';
      case 'stable': return 'bg-blue-500';
      case 'attention': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Función para obtener el color de fondo del estado
  const obtenerFondoEstado = (estado) => {
    switch(estado) {
      case 'optimal': return 'bg-green-50 border-green-200';
      case 'stable': return 'bg-blue-50 border-blue-200';
      case 'attention': return 'bg-yellow-50 border-yellow-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Función para obtener el color de texto del estado
  const obtenerTextoColorEstado = (estado) => {
    switch(estado) {
      case 'optimal': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'attention': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Métricas del Sistema</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTipoGrafico('rendimiento')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              tipoGrafico === 'rendimiento' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gestión
          </button>
          <button
            onClick={() => setTipoGrafico('incidencias')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              tipoGrafico === 'incidencias' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Incidencias
          </button>
        </div>
      </div>

      {tipoGrafico === 'rendimiento' ? (
        <div className="space-y-6">
          {/* ✅ Gráfico de Tasa de Resolución con datos REALES */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Tasa de Resolución de Incidencias
              {metricasReales && (
                <span className="text-xs text-gray-500 ml-2">
                  (Promedio del sistema)
                </span>
              )}
            </h4>
            <div className="space-y-3">
              {datosRendimientoReales.map((planta, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-32 text-sm text-gray-600 truncate">{planta.nombre}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            planta.tasaResolucion > 80 ? 'bg-green-500' : 
                            planta.tasaResolucion > 60 ? 'bg-blue-500' : 
                            planta.tasaResolucion > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${planta.tasaResolucion}%` }}
                        ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 text-right">
                      {planta.tasaResolucion}%
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Gráfico de Estado Operativo con datos REALES */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Estado Operativo</h4>
            <div className="grid grid-cols-5 gap-2">
              {datosRendimientoReales.map((planta, index) => (
                <div key={index} className="text-center">
                  <div className={`relative h-32 rounded-lg overflow-hidden border-2 ${obtenerFondoEstado(planta.estadoGeneral)}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${obtenerTextoColorEstado(planta.estadoGeneral)}`}>
                          {planta.incidenciasActivas}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Incidencias activas</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 truncate">
                    {planta.nombre.split(' ')[0]}
                  </div>
                  <div className={`text-xs font-semibold ${obtenerTextoColorEstado(planta.estadoGeneral)}`}>
                    {obtenerTextoEstado(planta.estadoGeneral)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {planta.mantenimientosPendientes} mant. pend.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Métricas Adicionales de Gestión */}
   

  {/* ✅ INDICADORES DE MANTENIMIENTO - OCUPANDO TODO EL ESPACIO */}
<div className="pt-4 border-t border-gray-200">
  <h4 className="text-sm font-medium text-gray-700 mb-4">Indicadores de Mantenimiento</h4>
  <div className="grid grid-cols-1 gap-4">
    {datosRendimientoReales.map((planta, index) => {
      const mantenimientosCorrectivos = planta.totalMantenimientos - planta.mantenimientosPreventivos;
      const mantenimientosPendientes = planta.mantenimientosPendientes || 0;
      const mantenimientosCompletados = planta.mantenimientosCompletados || 0;
      
      return (
        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-sm font-medium text-gray-900 mb-3 text-center">
            {planta.nombre}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {/* DISTRIBUCIÓN DE TIPOS */}
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Tipos de Mantenimiento</span>
                <span>{planta.totalMantenimientos} total</span>
              </div>
              <div className="flex space-x-1 mb-2">
                <div 
                  className="h-2 bg-green-400 rounded-full"
                  style={{ width: `${planta.ratioMantenimientoPreventivo}%` }}
                ></div>
                <div 
                  className="h-2 bg-orange-400 rounded-full" 
                  style={{ width: `${100 - planta.ratioMantenimientoPreventivo}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">{planta.mantenimientosPreventivos} preventivo</span>
                <span className="text-orange-600">{mantenimientosCorrectivos} correctivo</span>
              </div>
            </div>

            {/* ESTADO */}
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-600 mb-3 text-center">Estado de mantenimientos</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="font-semibold text-blue-600 text-lg">{mantenimientosCompletados}</div>
                  <div className="text-xs text-gray-500">Completados</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold text-lg ${mantenimientosPendientes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {mantenimientosPendientes}
                  </div>
                  <div className="text-xs text-gray-500">Pendientes</div>
                </div>
              </div>
            </div>

            {/* REPORTES */}
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-600 mb-2 text-center">Reportes</div>
              <div className="text-center">
                <div className="font-semibold text-purple-600 text-2xl">{planta.reportesGenerados || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Generados</div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

        </div>
      ) : (
        <div className="space-y-6">
          {/* ✅ GRÁFICO CORREGIDO - DATOS REALES Y ESCALA DINÁMICA */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Incidencias de la Última Semana
            </h4>
            
            {datosIncidenciasReales.pendientes.every(val => val === 0) && 
             datosIncidenciasReales.resueltas.every(val => val === 0) ? (
              // ✅ MOSTRAR MENSAJE SI NO HAY DATOS
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No hay incidencias en la última semana</p>
              </div>
            ) : (
              // ✅ GRÁFICO CON ESCALA DINÁMICA
              <div className="flex items-end justify-between h-48 px-4 border-b border-l border-gray-200">
                {datosIncidenciasReales.labels.map((dia, index) => (
                  <div key={dia} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="flex items-end space-x-1 h-40">
                      {/* ✅ BARRA PENDIENTES - ALTURA PROPORCIONAL */}
                      <div 
                        className="w-4 bg-red-400 rounded-t transition-all duration-500 hover:bg-red-500 cursor-help"
                        style={{ 
                          height: `${(datosIncidenciasReales.pendientes[index] / maxIncidencias) * 120}px`,
                          minHeight: datosIncidenciasReales.pendientes[index] > 0 ? '4px' : '0px'
                        }}
                        title={`${datosIncidenciasReales.pendientes[index]} pendientes`}
                      ></div>
                      
                      {/* ✅ BARRA RESUELTAS - ALTURA PROPORCIONAL */}
                      <div 
                        className="w-4 bg-green-400 rounded-t transition-all duration-500 hover:bg-green-500 cursor-help"
                        style={{ 
                          height: `${(datosIncidenciasReales.resueltas[index] / maxIncidencias) * 120}px`,
                          minHeight: datosIncidenciasReales.resueltas[index] > 0 ? '4px' : '0px'
                        }}
                        title={`${datosIncidenciasReales.resueltas[index]} resueltas`}
                      ></div>
                    </div>
                    
                    {/* ✅ MOSTRAR NÚMEROS EN LAS BARRAS (si hay datos) */}
                    <div className="text-center">
                      {datosIncidenciasReales.pendientes[index] > 0 && (
                        <div className="text-xs text-red-600 font-medium mb-1">
                          {datosIncidenciasReales.pendientes[index]}
                        </div>
                      )}
                      {datosIncidenciasReales.resueltas[index] > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          {datosIncidenciasReales.resueltas[index]}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 font-medium">{dia}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* ✅ LEYENDA MEJORADA */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-xs text-gray-600">Pendientes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-xs text-gray-600">Resueltas</span>
              </div>
            </div>
          </div>

          {/* ✅ Resumen de incidencias con datos REALES */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {incidencias.filter(i => i.estado === 'pendiente').length}
                </div>
                <div className="text-sm text-red-700">Pendientes</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {incidencias.filter(i => i.estado === 'en_progreso').length}
                </div>
                <div className="text-sm text-blue-700">En Progreso</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {incidencias.filter(i => i.estado === 'resuelto').length}
                </div>
                <div className="text-sm text-green-700">Resueltas</div>
              </div>
            </div>
          </div>

          {/* ✅ Distribución de Incidencias por Planta */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Incidencias por Planta</h4>
            <div className="space-y-2">
              {datosRendimientoReales.map((planta, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 truncate flex-1">{planta.nombre}</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-xs text-gray-500">
                      {planta.incidenciasActivas} activas
                    </div>
                    <div className={`w-3 h-3 rounded-full ${obtenerColorEstado(planta.estadoGeneral)}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}