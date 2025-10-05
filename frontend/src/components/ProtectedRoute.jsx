import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, login, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setLoading(true);
        const response = await authService.checkAuth();
        
        if (response.success) {
          login(response.user, response.token);
        }
      } catch (error) {
        console.log('Usuario no autenticado');
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