import { api } from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/iniciar-sesion', {
      email,
      password,
    });
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
    code, // El código de 6 dígitos
  });
  return response.data;
},



};

