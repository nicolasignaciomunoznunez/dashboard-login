import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/authService';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plantas from './pages/Plantas';
import PlantaDetalle from './pages/PlantaDetalle';
import Incidencias from './pages/Incidencias';
import Mantenimiento from './pages/Mantenimiento';
import Reportes from './pages/Reportes';
import LandingPage from './pages/LandingPage'; 

function App() {
  const { isAuthenticated, login, setLoading, isLoading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  console.log('🔄 [APP] Render - authChecked:', authChecked, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('🔄 [APP] useEffect montado - verificando autenticación inicial');
    
    const verifyInitialAuth = async () => {
      try {
        setLoading(true);
        console.log('🔐 [APP] Llamando a checkAuth...');
        
        const result = await authService.checkAuth();
        console.log('🔐 [APP] Resultado de checkAuth:', result);
        
        if (result.success && result.usuario) {
          console.log('✅ [APP] Usuario autenticado, haciendo login...');
          login(result.usuario);
        } else {
          console.log('❌ [APP] Usuario NO autenticado');
        }
      } catch (error) {
        console.error('❌ [APP] Error crítico en verifyInitialAuth:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
        console.log('✅ [APP] Verificación inicial completada');
      }
    };

    if (!authChecked) {
      verifyInitialAuth();
    }
  }, [authChecked, login, setLoading]);

  if (!authChecked || isLoading) {
    console.log('🔄 [APP] Mostrando loading inicial...');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  console.log('✅ [APP] Renderizando aplicación - isAuthenticated:', isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ RUTA PÚBLICA PRINCIPAL: Landing Page (siempre accesible) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* ✅ RUTAS PÚBLICAS: Login y Register (redirigen a dashboard si ya está autenticado) */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        
        {/* ✅ RUTAS PROTEGIDAS DEL DASHBOARD */}
        <Route path="/dashboard" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="plantas" element={<Plantas />} />
          <Route path="plantas/:id" element={<PlantaDetalle />} />
          <Route path="incidencias" element={<Incidencias />} />
          <Route path="mantenimientos" element={<Mantenimiento />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>

        {/* ✅ REDIRECCIONES PARA RUTAS DIRECTAS CUANDO ESTÁ AUTENTICADO */}
        {isAuthenticated && (
          <>
            <Route path="/plantas" element={<Navigate to="/dashboard/plantas" replace />} />
            {/* ✅ SE ELIMINÓ la línea problemática que causaba el :id literal */}
            <Route path="/incidencias" element={<Navigate to="/dashboard/incidencias" replace />} />
            <Route path="/mantenimientos" element={<Navigate to="/dashboard/mantenimientos" replace />} />
            <Route path="/reportes" element={<Navigate to="/dashboard/reportes" replace />} />
          </>
        )}

        {/* ✅ REDIRECCIÓN GLOBAL MEJORADA */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;