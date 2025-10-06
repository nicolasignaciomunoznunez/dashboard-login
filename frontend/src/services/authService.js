import { api } from './api';

export const authService = {
  // Login con debug
  login: async (email, password) => {
    console.log('🔐 [AUTH SERVICE] Enviando login...', { email });
    const response = await api.post('/auth/iniciar-sesion', {
      email,
      password,
    });
    console.log('🔐 [AUTH SERVICE] Respuesta login:', response.data);
    return response.data;
  },

  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/registrar', userData);
    return response.data;
  },

  // Verificar autenticación
  checkAuth: async () => {
    const response = await api.get('/auth/verificar-autenticacion');
    console.log('🔐 [AUTH SERVICE] Verificar autenticación:', response.data);
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  // Olvidé contraseña
  forgotPassword: async (email) => {
    const response = await api.post('/auth/olvide-contraseña', { email });
    return response.data;
  },

  // Resetear contraseña
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/restablecer-contraseña/${token}`, {
      password,
    });
    return response.data;
  },

  // Cerrar sesión
  logout: async () => {
    const response = await api.post('/auth/cerrar-sesion');
    return response.data;
  },

  // Verificar email
  verifyEmail: async (code) => {
    const response = await api.post('/auth/verificar-email', {
      code,
    });
    return response.data;
  },
};