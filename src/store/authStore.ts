
// =============== src/store/authStore.ts ===============
import { create as createZustand } from 'zustand';
import { apiClient as api } from '../lib/apiClient';
import type { User as UserType } from '../types';

interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = createZustand<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<UserType>('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
}));