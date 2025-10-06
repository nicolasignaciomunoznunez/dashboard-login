// components/ProtectedRoute.jsx - VERSIÓN SIMPLIFICADA (opcional)
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Si aún quieres usar ProtectedRoute para algunas rutas específicas
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}