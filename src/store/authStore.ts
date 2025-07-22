import { create } from 'zustand';
import { apiClient } from '../lib/apiClient';
import { User } from '../types';

// Define the shape of the state and its actions
interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in a loading state until we've checked for a session

  // Action to check if a user is already logged in (e.g., via a cookie)
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get<User>('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      // If the request fails, it means the user is not authenticated
      set({ user: null, isLoading: false });
    }
  },

  // Action to log the user out
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
}));
