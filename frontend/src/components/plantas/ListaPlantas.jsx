import { usePlantasStore } from '../../stores/plantasStore';
import TarjetaPlanta from './TarjetaPlanta';

export default function ListaPlantas({ plantas, onEditarPlanta, loading }) {
  const { eliminarPlanta } = usePlantasStore();

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta planta?')) {
      try {
        await eliminarPlanta(id);
      } catch (error) {
        console.error('Error eliminando planta:', error);
      }
    }
  };

  if (plantas.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay plantas registradas</h3>
        <p className="text-gray-500">Comienza agregando tu primera planta al sistema.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plantas.map((planta) => (
        <TarjetaPlanta
          key={planta.id}
          planta={planta}
          onEditar={() => onEditarPlanta(planta)}
          onEliminar={() => handleEliminar(planta.id)}
        />
      ))}
    </div>
  );
}