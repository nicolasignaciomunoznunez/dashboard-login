import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react'; // ✅ Agregar useEffect
import { useAuthStore } from './stores/authStore';
import { authService } from './services/authService'; // ✅ Agregar authService
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plantas from './pages/Plantas';
import PlantaDetalle from './pages/PlantaDetalle';
import Incidencias from './pages/Incidencias';
import Mantenimiento from './pages/Mantenimiento';
import Reportes from './pages/Reportes';

function App() {
  const { isAuthenticated, login, setLoading, isLoading } = useAuthStore();

  // ✅ Efecto para verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 [APP] Verificando autenticación...');
        const response = await authService.checkAuth();
        
        console.log('🔐 [APP] Respuesta verificación:', response);
        
        // ✅ CORRECCIÓN: Usar response.usuario
        if (response.success && response.usuario) {
          console.log('✅ [APP] Usuario autenticado:', response.usuario);
          login(response.usuario); // No necesitamos token porque viene en cookie
        } else {
          console.log('🔐 [APP] No hay usuario autenticado');
          setLoading(false);
        }
      } catch (error) {
        console.log('🔐 [APP] Error en verificación:', error);
        setLoading(false);
      }
    };

    // Solo verificar si no está autenticado pero podría estarlo (token en cookies)
    if (!isAuthenticated) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, login, setLoading]);

  // ✅ Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="plantas" element={<Plantas />} />
          <Route path="plantas/:id" element={<PlantaDetalle />} />
          <Route path="incidencias" element={<Incidencias/>} />
          <Route path="mantenimientos" element={<Mantenimiento/>} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;