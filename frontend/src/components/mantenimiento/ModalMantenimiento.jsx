import { useState, useEffect, useCallback } from 'react';
import { useMantenimientoStore } from '../../stores/mantenimientoStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';
import BadgeTipo from '../dashboard/BadgeTipo'; // ✅ REUTILIZAR
import BadgeEstado from '../dashboard/BadgeEstado'; // ✅ REUTILIZAR

export default function ModalMantenimiento({ isOpen, onClose, mantenimiento, plantaPreSeleccionada }) {
  const { crearMantenimiento, actualizarMantenimiento, loading } = useMantenimientoStore();
  const { plantas, obtenerPlantas } = usePlantasStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    tipo: 'preventivo',
    descripcion: '',
    fechaProgramada: '',
    estado: 'pendiente'
  });
  const [errors, setErrors] = useState({});

  // ✅ OPTIMIZACIÓN: useCallback para evitar recreación
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      obtenerPlantas(50);
    }
  }, [isOpen, obtenerPlantas]);

  // ✅ OPTIMIZACIÓN: Reset más eficiente
  useEffect(() => {
    if (!isOpen) return;

    if (mantenimiento) {
      setFormData({
        plantId: mantenimiento.plantId || '',
        tipo: mantenimiento.tipo || 'preventivo',
        descripcion: mantenimiento.descripcion || '',
        fechaProgramada: mantenimiento.fechaProgramada ? 
          new Date(mantenimiento.fechaProgramada).toISOString().split('T')[0] : '',
        estado: mantenimiento.estado || 'pendiente'
      });
    } else {
      setFormData({
        plantId: plantaPreSeleccionada || '',
        tipo: 'preventivo',
        descripcion: '',
        fechaProgramada: '',
        estado: 'pendiente'
      });
    }
    setErrors({});
  }, [mantenimiento, plantaPreSeleccionada, isOpen]);

  // ✅ OPTIMIZACIÓN: Validación más eficiente
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.plantId) {
      newErrors.plantId = 'Selecciona una planta';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.fechaProgramada) {
      newErrors.fechaProgramada = 'La fecha programada es requerida';
    } else {
      const selectedDate = new Date(formData.fechaProgramada);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fechaProgramada = 'La fecha no puede ser en el pasado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ✅ MEJORA: Limpiar error solo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mantenimiento) {
        await actualizarMantenimiento(mantenimiento.id, formData);
      } else {
        await crearMantenimiento({
          ...formData,
          userId: user?.id
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      // ✅ MEJORA: Mostrar error al usuario
      setErrors(prev => ({
        ...prev,
        submit: 'Error al guardar el mantenimiento. Intenta nuevamente.'
      }));
    }
  };

  // ✅ MEJORA: Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const esEdicion = !!mantenimiento;
  const puedeGestionarEstado = user?.rol === 'admin' || user?.rol === 'tecnico';

  // ✅ ELIMINAMOS: tiposMantenimiento y estadosMantenimiento - USAMOS BADGES

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Actualiza la información del mantenimiento' : 'Programa un nuevo mantenimiento para la planta'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error general de submit */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          {/* Campo Planta */}
          <div className="space-y-2">
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700">
              Planta *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              value={formData.plantId}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.plantId 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Seleccionar planta...</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre} - {planta.ubicacion}
                </option>
              ))}
            </select>
            {errors.plantId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.plantId}
              </p>
            )}
          </div>

          {/* Campo Tipo */}
          <div className="space-y-2">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo de Mantenimiento *
            </label>
            <div className="flex gap-3">
              <select
                id="tipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
              {/* ✅ REEMPLAZADO POR BADGE */}
              <BadgeTipo tipo={formData.tipo} />
            </div>
            <p className="text-xs text-gray-500">
              {formData.tipo === 'preventivo' 
                ? 'Mantenimiento programado para prevenir fallos' 
                : 'Mantenimiento para corregir fallos existentes'
              }
            </p>
          </div>

          {/* Campo Fecha Programada */}
          <div className="space-y-2">
            <label htmlFor="fechaProgramada" className="block text-sm font-medium text-gray-700">
              Fecha Programada *
            </label>
            <input
              type="date"
              id="fechaProgramada"
              name="fechaProgramada"
              required
              value={formData.fechaProgramada}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.fechaProgramada 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            />
            {errors.fechaProgramada && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.fechaProgramada}
              </p>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción del Mantenimiento *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.descripcion 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Describe en detalle las tareas de mantenimiento a realizar, herramientas necesarias y procedimientos..."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.descripcion}
              </p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mínimo 10 caracteres</span>
              <span className={formData.descripcion.length < 10 ? 'text-red-500' : 'text-green-500'}>
                {formData.descripcion.length}/10
              </span>
            </div>
          </div>

          {/* Campo Estado (solo para admin/tecnico) */}
          {puedeGestionarEstado && (
            <div className="space-y-2">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado del Mantenimiento
              </label>
              <div className="flex gap-3">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                </select>
                {/* ✅ REEMPLAZADO POR BADGE */}
                <BadgeEstado estado={formData.estado} />
              </div>
              <p className="text-xs text-gray-500">
                Solo administradores y técnicos pueden modificar el estado.
              </p>
            </div>
          )}

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
                  {esEdicion ? 'Actualizar' : 'Programar'} Mantenimiento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}