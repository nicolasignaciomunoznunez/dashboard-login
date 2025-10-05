import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

export default function Header() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sistema de Gestión</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-gray-700">{user?.nombre || 'Usuario'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}