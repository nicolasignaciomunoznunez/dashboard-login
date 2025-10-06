// stores/authStore.js - CON DEBUG MEJORADO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (userData, authToken) => {
        console.log('🔄 [AUTH STORE] EJECUTANDO LOGIN:', { 
          userData, 
          tieneRol: !!userData?.rol,
          rol: userData?.rol 
        });
        
        set({ 
          user: userData, 
          token: authToken, 
          isAuthenticated: true,
          isLoading: false 
        });
        
        console.log('✅ [AUTH STORE] ESTADO DESPUÉS DE LOGIN:', get());
      },

      logout: () => {
        console.log('🔄 [AUTH STORE] EJECUTANDO LOGOUT');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      setLoading: (loading) => {
        console.log('🔄 [AUTH STORE] setLoading:', loading);
        set({ isLoading: loading });
      },

      updateUser: (userData) => {
        console.log('🔄 [AUTH STORE] Actualizando usuario:', userData);
        set({ user: { ...get().user, ...userData } });
      },

      tieneRol: (roles) => {
        const { user } = get();
        if (!user || !user.rol) return false;
        return Array.isArray(roles) ? roles.includes(user.rol) : user.rol === roles;
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        console.log('🔄 [AUTH STORE] Rehidratando estado...');
        return (state) => {
          console.log('✅ [AUTH STORE] Estado rehidratado:', state);
        };
      }
    }
  )
);