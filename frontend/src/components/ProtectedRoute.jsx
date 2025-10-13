// components/ProtectedRoute.jsx - VERSIÓN MEJORADA
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  roles = [],
  redirectTo = '/login'
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // ✅ LOG para debugging de accesos directos por URL
    if (!isLoading && user) {
      console.log('🔐 [PROTECTED ROUTE] Acceso por URL:', {
        path: location.pathname,
        usuario: user.nombre,
        rol: user.rol,
        rolesRequeridos: roles,
        tienePermiso: roles.length === 0 || roles.includes(user.rol)
      });
    }
  }, [location.pathname, user, isLoading, roles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 [PROTECTED ROUTE] No autenticado, redirigiendo a login');
    return <Navigate to={redirectTo} replace />;
  }

  if (roles.length > 0 && user?.rol && !roles.includes(user.rol)) {
    console.log('🚫 [PROTECTED ROUTE] Acceso denegado por URL directa:', {
      ruta: location.pathname,
      rolUsuario: user.rol,
      rolesRequeridos: roles
    });
    
    // ✅ Mostrar página de acceso denegado
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <strong>Ruta:</strong> {location.pathname}<br />
            <strong>Tu rol:</strong> <span className="capitalize">{user.rol}</span><br />
            <strong>Permiso requerido:</strong> {roles.join(', ')}
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}