import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, login, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setLoading(true);
        console.log('🔐 [PROTECTED ROUTE] Verificando autenticación...');
        const response = await authService.checkAuth();
        
        console.log('🔐 [PROTECTED ROUTE] Respuesta:', response);
        
        // ✅ CORRECCIÓN: Usar response.usuario en lugar de response.user
        if (response.success && response.usuario) {
          console.log('✅ [PROTECTED ROUTE] Usuario autenticado:', response.usuario);
          console.log('✅ [PROTECTED ROUTE] Rol del usuario:', response.usuario.rol);
          login(response.usuario); // No necesitamos token porque viene en cookie
        } else {
          console.log('🔐 [PROTECTED ROUTE] No hay usuario autenticado');
        }
      } catch (error) {
        console.log('🔐 [PROTECTED ROUTE] Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      checkAuthentication();
    }
  }, [isAuthenticated, login, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}