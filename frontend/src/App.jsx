import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plantas from './pages/Plantas';
import PlantaDetalle from './pages/PlantaDetalle';

function App() {
  const { isAuthenticated } = useAuthStore();

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
          <Route path="incidencias" element={<div className="p-6">Incidencias</div>} />
          <Route path="mantenimientos" element={<div className="p-6">Mantenimientos</div>} />
          <Route path="reportes" element={<div className="p-6">Reportes</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;