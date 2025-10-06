// components/mantenimiento/ChecklistMantenimiento.jsx
import { useState, useEffect } from 'react';
import { useChecklistStore } from '../../stores/checklistStore';

// ✅ AGREGAR export default
export default function ChecklistMantenimiento({ mantenimientoId, readonly = false }) {
  const { checklist, loading, error, obtenerChecklist, crearItemChecklist, toggleCompletadoItem, eliminarItemChecklist } = useChecklistStore();
  const [nuevoItem, setNuevoItem] = useState('');

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
    try {
      await toggleCompletadoItem(mantenimientoId, itemId, completado);
    } catch (error) {
      console.error('Error al actualizar item:', error);
    }
  };

  const handleEliminarItem = async (itemId) => {
    if (!confirm('¿Estás seguro de eliminar este item?')) return;
    
    try {
      await eliminarItemChecklist(mantenimientoId, itemId);
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const itemsCompletados = checklist.filter(item => item.completado).length;
  const progreso = checklist.length > 0 ? (itemsCompletados / checklist.length) * 100 : 0;

  if (loading && checklist.length === 0) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de progreso */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900">Progreso del Checklist</h3>
          <span className="text-sm text-gray-600">
            {itemsCompletados} de {checklist.length} completados
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
      </div>

      {/* Formulario para agregar items (solo si no es readonly) */}
      {!readonly && (
        <form onSubmit={handleAgregarItem} className="flex space-x-2">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Agregar nuevo item al checklist..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Agregar
          </button>
        </form>
      )}

      {/* Lista de items */}
      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <input
                type="checkbox"
                checked={item.completado || false}
                onChange={(e) => handleToggleCompletado(item.id, e.target.checked)}
                disabled={readonly}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <div className="flex-1">
                <p className={`font-medium ${item.completado ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.item}
                </p>
                {item.observaciones && (
                  <p className="text-sm text-gray-600 mt-1">{item.observaciones}</p>
                )}
              </div>
            </div>
            
            {!readonly && (
              <button
                onClick={() => handleEliminarItem(item.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Eliminar item"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {checklist.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No hay items en el checklist</p>
          {!readonly && <p className="text-sm">Agrega items para comenzar</p>}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}