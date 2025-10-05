import { useState, useEffect } from 'react';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';

export default function ModalPlanta({ isOpen, onClose, planta }) {
  const { crearPlanta, actualizarPlanta, loading } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    clienteId: ''
  });

  useEffect(() => {
    if (planta) {
      setFormData({
        nombre: planta.nombre || '',
        ubicacion: planta.ubicacion || '',
        clienteId: planta.clienteId || user?.id || '' // Usar el ID del usuario actual
      });
    } else {
      setFormData({
        nombre: '',
        ubicacion: '',
        clienteId: user?.id || '' // Por defecto, el usuario actual
      });
    }
  }, [planta, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }
    
    if (!formData.clienteId) {
      alert('Cliente ID es requerido');
      return;
    }

    try {
      if (planta) {
        await actualizarPlanta(planta.id, formData);
      } else {
        await crearPlanta(formData);
      }
      onClose();
    } catch (error) {
      // El error se maneja en el store
      console.error('Error al guardar planta:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {planta ? 'Editar Planta' : 'Nueva Planta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Planta *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Planta Principal"
            />
          </div>

          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación *
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              required
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Av. Principal 123"
            />
          </div>

          {/* Cliente ID - siempre visible pero pre-llenado */}
          <div>
            <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente ID *
            </label>
            <input
              type="text"
              id="clienteId"
              name="clienteId"
              required
              value={formData.clienteId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
              placeholder="ID del cliente"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este campo se completa automáticamente con tu ID de usuario
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (planta ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}