import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: (userData, authToken) => {
        console.log('🔐 [AUTH STORE] Login:', { 
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
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (userData) => {
        console.log('🔐 [AUTH STORE] Actualizando usuario:', userData);
        set({ user: { ...get().user, ...userData } });
      },

      // ✅ NUEVO: Verificar permisos
      tieneRol: (roles) => {
        const { user } = get();
        if (!user || !user.rol) return false;
        return Array.isArray(roles) ? roles.includes(user.rol) : user.rol === roles;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);