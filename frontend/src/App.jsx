// App.jsx - VERSIÓN CON LANDING PAGE
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
import LandingPage from './pages/LandingPage'; // ✅ Agregar Landing Page

function App() {
  const { isAuthenticated, login, setLoading, isLoading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  console.log('🔄 [APP] Render - authChecked:', authChecked, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // ✅ Efecto que se ejecuta SOLO UNA VEZ al montar la app
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
          // No hacer nada, dejar isAuthenticated en false
        }
      } catch (error) {
        console.error('❌ [APP] Error crítico en verifyInitialAuth:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
        console.log('✅ [APP] Verificación inicial completada');
      }
    };

    // Ejecutar solo si no hemos verificado antes
    if (!authChecked) {
      verifyInitialAuth();
    }
  }, [authChecked, login, setLoading]);

  // ✅ Loading inicial (ANTES de verificar autenticación)
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
        
        {/* ✅ RUTAS PÚBLICAS: Login y Register (solo cuando NO está autenticado) */}
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Redirigir rutas desconocidas al landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* ✅ RUTAS PROTEGIDAS DEL DASHBOARD (solo cuando ESTÁ autenticado) */
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="plantas" element={<Plantas />} />
            <Route path="plantas/:id" element={<PlantaDetalle />} />
            <Route path="incidencias" element={<Incidencias />} />
            <Route path="mantenimientos" element={<Mantenimiento />} />
            <Route path="reportes" element={<Reportes />} />
            {/* Redirigir rutas desconocidas del dashboard al dashboard principal */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;