import { useState, useEffect } from 'react';
import { useIncidenciasStore } from '../../stores/incidenciasStore';
import { usePlantasStore } from '../../stores/plantasStore';
import { useAuthStore } from '../../stores/authStore';

export default function ModalIncidencia({ isOpen, onClose, incidencia, plantaPreSeleccionada }) {
  const { crearIncidencia, cambiarEstadoIncidencia, loading } = useIncidenciasStore();
  const { plantas, obtenerPlantas } = usePlantasStore(); // ✅ Removí resetearPlantasCargadas
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    plantId: plantaPreSeleccionada || '',
    titulo: '',
    descripcion: '',
    estado: 'pendiente'
  });

  // ✅ SOLUCIÓN: Solo obtener plantas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 MODAL INCIDENCIA: Abierto - Obteniendo plantas');
      obtenerPlantas(50);
    }
  }, [isOpen]); // ✅ Solo isOpen como dependencia

  // ✅ SOLUCIÓN: Resetear formulario cuando cambian las props
  useEffect(() => {
    if (incidencia) {
      setFormData({
        plantId: incidencia.plantId || '',
        titulo: incidencia.titulo || '',
        descripcion: incidencia.descripcion || '',
        estado: incidencia.estado || 'pendiente'
      });
    } else {
      setFormData({
        plantId: plantaPreSeleccionada || '',
        titulo: '',
        descripcion: '',
        estado: 'pendiente'
      });
    }
  }, [incidencia, plantaPreSeleccionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (incidencia) {
        // Editar incidencia existente
        await cambiarEstadoIncidencia(incidencia.id, formData.estado);
      } else {
        // Crear nueva incidencia
        await crearIncidencia(formData);
      }
      
      onClose(); // Cerrar modal después de guardar
    } catch (error) {
      console.error('Error al guardar incidencia:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // ✅ Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {incidencia ? 'Editar Incidencia' : 'Reportar Nueva Incidencia'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Bomba principal fallando"
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
              placeholder="Describa el problema en detalle..."
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
                <option value="resuelto">Resuelto</option>
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
              {loading ? 'Guardando...' : (incidencia ? 'Actualizar' : 'Reportar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}