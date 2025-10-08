// components/mantenimiento/ChecklistMantenimiento.jsx
import { useState, useEffect } from 'react';
import { useChecklistStore } from '../../stores/checklistStore';

export default function ChecklistMantenimiento({ mantenimientoId, readonly = false }) {
  const { 
    checklist, 
    loading, 
    error, 
    obtenerChecklist, 
    crearItemChecklist, 
    toggleCompletadoItem, 
    eliminarItemChecklist 
  } = useChecklistStore();
  
  const [nuevoItem, setNuevoItem] = useState('');
  const [itemActualizando, setItemActualizando] = useState(null);

  useEffect(() => {
    if (mantenimientoId) {
      obtenerChecklist(mantenimientoId);
    }
  }, [mantenimientoId, obtenerChecklist]);

  const handleAgregarItem = async (e) => {
    e.preventDefault();
    if (!nuevoItem.trim()) return;

    try {
      await crearItemChecklist(mantenimientoId, { item: nuevoItem.trim() });
      setNuevoItem('');
    } catch (error) {
      console.error('Error al agregar item:', error);
    }
  };

  const handleToggleCompletado = async (itemId, completado) => {
    if (readonly) return;
    
    setItemActualizando(itemId);
    try {
      await toggleCompletadoItem(mantenimientoId, itemId, completado);
    } catch (error) {
      console.error('Error al actualizar item:', error);
    } finally {
      setItemActualizando(null);
    }
  };

  const handleEliminarItem = async (itemId) => {
    if (!confirm('¿Estás seguro de eliminar este item del checklist?')) return;
    
    try {
      await eliminarItemChecklist(mantenimientoId, itemId);
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const itemsCompletados = checklist.filter(item => item.completado).length;
  const progreso = checklist.length > 0 ? (itemsCompletados / checklist.length) * 100 : 0;

  // Determinar color de la barra de progreso según el porcentaje
  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading && checklist.length === 0) {
    return (
      <div className="animate-pulse space-y-3">
        {/* Skeleton de la barra de progreso */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Skeleton del formulario */}
        {!readonly && (
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-20 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        )}
        
        {/* Skeleton de items */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de progreso mejorada */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">Progreso del Checklist</h3>
          <span className="text-sm font-medium text-gray-700">
            {itemsCompletados} de {checklist.length} completados
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(progreso)}`}
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span className={`font-medium ${
            progreso === 100 ? 'text-green-600' : 
            progreso >= 50 ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            {Math.round(progreso)}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Formulario para agregar items (solo si no es readonly) */}
      {!readonly && (
        <form onSubmit={handleAgregarItem} className="flex gap-2">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Agregar nueva tarea al checklist..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
          />
          <button
            type="submit"
            disabled={!nuevoItem.trim()}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </form>
      )}

      {/* Lista de items mejorada */}
      <div className="space-y-2">
        {checklist.map((item) => {
          const estaActualizando = itemActualizando === item.id;
          
          return (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-all duration-200 ${
                item.completado 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              } ${estaActualizando ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={item.completado || false}
                    onChange={(e) => handleToggleCompletado(item.id, e.target.checked)}
                    disabled={readonly || estaActualizando}
                    className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {estaActualizando && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium text-sm ${
                    item.completado 
                      ? 'line-through text-green-700' 
                      : 'text-gray-900'
                  }`}>
                    {item.item}
                  </p>
                  
                  {item.observaciones && (
                    <p className="text-xs text-gray-600 mt-1">{item.observaciones}</p>
                  )}
                  
                  {item.fechaCompletado && item.completado && (
                    <p className="text-xs text-green-600 mt-1">
                      Completado: {new Date(item.fechaCompletado).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {!readonly && (
                <button
                  onClick={() => handleEliminarItem(item.id)}
                  disabled={estaActualizando}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Eliminar item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state mejorado */}
      {checklist.length === 0 && !loading && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No hay tareas en el checklist</p>
          {!readonly && (
            <p className="text-sm text-gray-500 mt-1">Agrega tareas para organizar el mantenimiento</p>
          )}
        </div>
      )}

      {/* Mensaje de error mejorado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-sm font-bold">!</span>
          </div>
          <div>
            <p className="font-medium">Error al cargar checklist</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Estado completado */}
      {progreso === 100 && checklist.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">¡Checklist completado!</span>
          </div>
        </div>
      )}
    </div>
  );
}