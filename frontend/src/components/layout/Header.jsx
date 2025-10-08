import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo y Branding */}
        <div className="flex items-center gap-4">
          {/* Espacio para el Logo - puedes reemplazar con tu imagen */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              {/* Logo temporal - reemplaza con tu imagen */}
                     <img 
  src="../public/images/finalogo.jpeg" 
  alt="RYV SPA" 
  className="h-20 w-auto"
/>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                RYV SPA
              </h1>
              <p className="text-xs text-gray-500 font-medium">Sistema de Gestión</p>
            </div>
          </div>

          {/* Separador opcional */}
          <div className="hidden md:block h-6 w-px bg-gray-200"></div>

          {/* Información rápida del sistema - opcional */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Sistema activo</span>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Notificaciones u otros elementos pueden ir aquí */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 5.5 3.366M3.75 21h13.5a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5z" />
              </svg>
            </button>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Usuario'}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <span className="text-white text-sm font-semibold">
                      {getUserInitials()}
                    </span>
                  </div>
                  {/* Indicador de estado */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-80">
                {/* Header del dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email || 'No email'}</p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{user?.rol || 'Usuario'}</p>
                </div>

                {/* Opciones del menú */}
                <div className="py-2">
                  <a
                    href="/dashboard/perfil"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </a>
                  <a
                    href="/dashboard/configuracion"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configuración
                  </a>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}