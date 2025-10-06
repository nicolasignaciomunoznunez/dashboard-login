// components/reportes/ModalReporte.jsx - ACTUALIZADO
import { useState } from 'react';
import { useReportesStore } from '../../stores/reportesStore';
import { useAuthStore } from '../../stores/authStore';

export default function ModalReporte({ isOpen, onClose, plantas }) {
  const { generarReporte, loading } = useReportesStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    plantId: '',
    tipo: 'general',
    descripcion: '',
    periodo: 'mensual'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.plantId) {
      alert('Selecciona una planta');
      return;
    }

    try {
      // ✅ GENERAR RUTA_ARCHIVO AUTOMÁTICAMENTE
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `reporte_${formData.tipo}_${formData.plantId}_${fecha}.pdf`;
      const rutaArchivo = `/reportes/${nombreArchivo}`;

      await generarReporte({
        ...formData,
        generadoPor: user?.id,
        rutaArchivo: rutaArchivo, // ✅ AGREGAR RUTA_ARCHIVO
        fecha: fecha // ✅ AGREGAR FECHA
      });
      
      onClose();
      // Resetear formulario
      setFormData({
        plantId: '',
        tipo: 'general',
        descripcion: '',
        periodo: 'mensual'
      });
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar reporte: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleClose = () => {
    onClose();
    // Resetear formulario al cerrar
    setFormData({
      plantId: '',
      tipo: 'general',
      descripcion: '',
      periodo: 'mensual'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Generar Nuevo Reporte
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Reporte *
              </label>
              <select
                id="tipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="general">General</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="incidencias">Incidencias</option>
                <option value="rendimiento">Rendimiento</option>
                <option value="calidad">Calidad del Agua</option>
              </select>
            </div>

            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
                Período *
              </label>
              <select
                id="periodo"
                name="periodo"
                required
                value={formData.periodo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Descripción adicional del reporte..."
            />
          </div>

          {/* ✅ INFORMACIÓN GENERADA AUTOMÁTICAMENTE */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Información del reporte:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Archivo:</strong> reporte_{formData.tipo}_{formData.plantId || 'X'}_{new Date().toISOString().split('T')[0]}.pdf</div>
              <div><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</div>
              <div><strong>Generado por:</strong> {user?.nombre}</div>
            </div>
          </div>

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
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}