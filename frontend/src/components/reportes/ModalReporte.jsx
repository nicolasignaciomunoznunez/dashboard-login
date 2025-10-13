// components/reportes/ModalReporte.jsx - MEJORADO
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
    periodo: 'mensual',
     titulo: ''  // ✅ AGREGAR TITULO
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
    // ✅ SOLO crear el registro en BD (sin enviar rutaArchivo)
    const response = await generarReporte({
      ...formData,
      generadoPor: user?.id,
      fecha: new Date().toISOString().split('T')[0],
       titulo: formData.titulo || `Reporte ${formData.tipo} - ${formData.periodo}`  // ✅ ENVIAR TITULO
    });
    
    // Inmediatamente descargar el PDF real usando el ID
    if (response.reporte?.id) {
      await useReportesStore.getState().descargarReporte(response.reporte.id);
    }
    
    onClose();
    setFormData({ plantId: '', tipo: 'general', descripcion: '', periodo: 'mensual' });
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
      periodo: 'mensual',
      titulo:''
    });
  };

  // Configuración de tipos de reporte
  const tiposReporte = {
    general: { label: 'General', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    mantenimiento: { label: 'Mantenimiento', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    incidencias: { label: 'Incidencias', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    rendimiento: { label: 'Rendimiento', color: 'text-green-600 bg-green-50 border-green-200' },
    calidad: { label: 'Calidad del Agua', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' }
  };

  // Configuración de períodos
  const periodosReporte = {
    diario: { label: 'Diario', color: 'text-gray-600 bg-gray-50 border-gray-200' },
    semanal: { label: 'Semanal', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    mensual: { label: 'Mensual', color: 'text-pink-600 bg-pink-50 border-pink-200' },
    trimestral: { label: 'Trimestral', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    anual: { label: 'Anual', color: 'text-red-600 bg-red-50 border-red-200' }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Generar Nuevo Reporte
              </h2>
              <p className="text-sm text-gray-500">
                Configura los parámetros para generar el reporte
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            >
              <option value="">Seleccionar planta...</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre} - {planta.ubicacion}
                </option>
              ))}
            </select>
          </div>
<div className="space-y-2">
    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
        Título del Reporte *
    </label>
    <input
        type="text"
        id="titulo"
        name="titulo"
        required
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Ej: Reporte Mensual de Operaciones"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
    />
</div>
          {/* Campos Tipo y Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo Tipo */}
            <div className="space-y-2">
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                Tipo de Reporte *
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
                  <option value="general">General</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="incidencias">Incidencias</option>
                  <option value="rendimiento">Rendimiento</option>
                  <option value="calidad">Calidad del Agua</option>
                </select>
                <span className={`px-4 py-3 rounded-xl text-sm font-medium border ${tiposReporte[formData.tipo]?.color}`}>
                  {tiposReporte[formData.tipo]?.label}
                </span>
              </div>
            </div>

            {/* Campo Período */}
            <div className="space-y-2">
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
                Período *
              </label>
              <div className="flex gap-3">
                <select
                  id="periodo"
                  name="periodo"
                  required
                  value={formData.periodo}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
                <span className={`px-4 py-3 rounded-xl text-sm font-medium border ${periodosReporte[formData.periodo]?.color}`}>
                  {periodosReporte[formData.periodo]?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-gray-400"
              placeholder="Descripción adicional del reporte..."
            />
            <p className="text-xs text-gray-500">
              Incluye observaciones o notas específicas para este reporte
            </p>
          </div>

          {/* Información del reporte */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información del reporte
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Archivo:</span>
                <span>reporte_{formData.tipo}_{formData.plantId || 'X'}_{new Date().toISOString().split('T')[0]}.pdf</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha:</span>
                <span>{new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Generado por:</span>
                <span>{user?.nombre}</span>
              </div>
            </div>
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
                  Generando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}