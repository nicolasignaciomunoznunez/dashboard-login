import { useState, useEffect, useCallback } from 'react';
import { useMantenimientoStore } from '../../stores/mantenimientoStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';

export default function ModalMantenimiento({ isOpen, onClose, mantenimiento, plantaPreSeleccionada }) {
  const { crearMantenimiento, actualizarMantenimiento, loading } = useMantenimientoStore();
  const { plantas, obtenerPlantas } = usePlantasStore(); // ✅ Removí resetearPlantasCargadas
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    tipo: 'preventivo',
    descripcion: '',
    fechaProgramada: '',
    estado: 'pendiente'
  });

  // ✅ SOLUCIÓN: handleClose simple
  const handleClose = () => {
    onClose();
  };

  // ✅ SOLUCIÓN SIMPLIFICADA: Solo obtener plantas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 MODAL MANTENIMIENTO: Abierto - Obteniendo plantas');
      obtenerPlantas(50);
    }
  }, [isOpen]); // ✅ Solo dependencia de isOpen

  // ✅ SOLUCIÓN: Resetear formulario cuando cambia mantenimiento o plantaPreSeleccionada
  useEffect(() => {
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
  }, [mantenimiento, plantaPreSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.plantId || !formData.descripcion || !formData.fechaProgramada) {
      alert('Planta, descripción y fecha programada son requeridos');
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
      alert('Error: ' + error.message);
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mantenimiento ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="plantId" className="block text-sm font-medium text-gray-700 mb-1">
              Planta *
            </label>
            <select
              id="plantId"
              name="plantId"
              required
              value={formData.plantId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccionar planta</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre} - {planta.ubicacion}
                </option>
              ))}
            </select>
          </div>

          {/* ... resto del formulario igual ... */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Mantenimiento *
            </label>
            <select
              id="tipo"
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>
          </div>

          <div>
            <label htmlFor="fechaProgramada" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describa las tareas de mantenimiento a realizar..."
            />
          </div>

          {(user?.rol === 'admin' || user?.rol === 'tecnico') && (
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (mantenimiento ? 'Actualizar' : 'Programar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}