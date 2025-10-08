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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (planta) {
      setFormData({
        nombre: planta.nombre || '',
        ubicacion: planta.ubicacion || '',
        clienteId: planta.clienteId || user?.id || ''
      });
    } else {
      setFormData({
        nombre: '',
        ubicacion: '',
        clienteId: user?.id || ''
      });
    }
    setErrors({});
  }, [planta, user, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    } else if (formData.ubicacion.trim().length < 5) {
      newErrors.ubicacion = 'La ubicación debe tener al menos 5 caracteres';
    }
    
    if (!formData.clienteId) {
      newErrors.clienteId = 'Cliente ID es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      console.error('Error al guardar planta:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const esEdicion = !!planta;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Planta' : 'Nueva Planta'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Actualiza la información de la planta' : 'Agrega una nueva planta al sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre de la Planta *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.nombre 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ej: Planta Principal Norte"
            />
            {errors.nombre && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.nombre}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Mínimo 3 caracteres. Usa un nombre descriptivo para la planta.
            </p>
          </div>

          {/* Campo Ubicación */}
          <div className="space-y-2">
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
              Ubicación *
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              required
              value={formData.ubicacion}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.ubicacion 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ej: Av. Principal 123, Ciudad, Región"
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.ubicacion}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Mínimo 5 caracteres. Incluye dirección completa para fácil ubicación.
            </p>
          </div>

          {/* Campo Cliente ID */}
          <div className="space-y-2">
            <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">
              Cliente ID *
            </label>
            <input
              type="text"
              id="clienteId"
              name="clienteId"
              required
              value={formData.clienteId}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 ${
                errors.clienteId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="ID del cliente"
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Este campo se completa automáticamente con tu ID de usuario</span>
            </div>
            {errors.clienteId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.clienteId}
              </p>
            )}
          </div>

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{user?.nombre || 'Usuario'}</p>
                <p className="text-gray-500 capitalize">{user?.rol || 'sin rol'}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {esEdicion ? 'Actualizar' : 'Crear'} Planta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}