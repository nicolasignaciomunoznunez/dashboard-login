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
        set({ user: { ...get().user, ...userData } });
      },
    }),
    {
      name: 'auth-storage', // nombre para localStorage
    }
  )
);