import { useEffect, useState } from 'react';
import { usePlantasStore } from '../stores/plantasStore';
import ModalPlanta from '../components/plantas/ModalPlanta';
import ListaPlantas from '../components/plantas/ListaPlantas';

export default function Plantas() {
  const { plantas, loading, error, obtenerPlantas } = usePlantasStore();
  const [showModal, setShowModal] = useState(false);
  const [plantaEditando, setPlantaEditando] = useState(null);

  useEffect(() => {
    obtenerPlantas();
  }, [obtenerPlantas]);

  const handleNuevaPlanta = () => {
    setPlantaEditando(null);
    setShowModal(true);
  };

  const handleEditarPlanta = (planta) => {
    setPlantaEditando(planta);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setPlantaEditando(null);
  };

  if (loading && plantas.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Plantas</h1>
        <button
          onClick={handleNuevaPlanta}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Nueva Planta
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ListaPlantas 
        plantas={plantas}
        onEditarPlanta={handleEditarPlanta}
        loading={loading}
      />

      <ModalPlanta
        isOpen={showModal}
        onClose={handleCerrarModal}
        planta={plantaEditando}
      />
    </div>
  );
}