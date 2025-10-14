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
    // Verificar autenticación - VERSIÓN MEJORADA
  checkAuth: async () => {
    try {
      console.log('🔐 [AUTH SERVICE] === INICIANDO checkAuth ===');
      const response = await api.get('/auth/verificar-autenticacion');
      console.log('🔐 [AUTH SERVICE] Respuesta checkAuth:', response.data);
      console.log('🔐 [AUTH SERVICE] === FIN checkAuth ===');
      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] Error en checkAuth:', error);
      // ⚠️ IMPORTANTE: Si hay error, retornamos success: false
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error de autenticación' 
      };
    }
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
  // Actualizar perfil
actualizarPerfil: async (datosPerfil) => {
  console.log('🔐 [AUTH SERVICE] Actualizando perfil...', datosPerfil);
  const response = await api.put('/auth/perfil', datosPerfil);
  console.log('🔐 [AUTH SERVICE] Perfil actualizado:', response.data);
  return response.data;
},

// Cambiar contraseña
cambiarContraseña: async (datosContraseña) => {
  console.log('🔐 [AUTH SERVICE] Cambiando contraseña...');
  const response = await api.post('/auth/cambiar-password', datosContraseña);
  console.log('🔐 [AUTH SERVICE] Contraseña cambiada:', response.data);
  return response.data;
},

};