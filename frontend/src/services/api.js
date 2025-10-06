import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para agregar token a las requests - CORREGIDO
api.interceptors.request.use(
  (config) => {
    // ✅ SOLUCIÓN: Obtener el token correctamente
    const token = obtenerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ NUEVA FUNCIÓN: Obtener token del localStorage correctamente
const obtenerToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;

    const authState = JSON.parse(authStorage);
    
    // Dependiendo de cómo esté estructurado tu auth store
    if (authState.state?.token) {
      return authState.state.token;
    }
    
    // O si está en la raíz del state
    if (authState.token) {
      return authState.token;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);