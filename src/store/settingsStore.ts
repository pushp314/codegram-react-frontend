// =============== src/store/settingsStore.ts ===============
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { apiClient } from '../lib/apiClient';

interface Preferences {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        mentions: boolean;
        likes: boolean;
        comments: boolean;
        follows: boolean;
    };
    privacy: {
        showEmail: boolean;
        showLocation: boolean;
        profileVisibility: 'public' | 'private';
    };
}

interface SettingsState {
    preferences: Preferences | null;
    isLoading: boolean;
    fetchPreferences: () => Promise<void>;
    updatePreferences: (updates: Partial<Preferences>) => Promise<void>;
}

export const useSettingsStore = create(
    immer<SettingsState>((set) => ({
        preferences: null,
        isLoading: true,
        fetchPreferences: async () => {
            set({ isLoading: true });
            try {
                const { data } = await apiClient.get('/settings/preferences');
                set({ preferences: data, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch preferences", error);
                set({ isLoading: false });
            }
        },
        updatePreferences: async (updates) => {
            set(state => {
                if (state.preferences) {
                    Object.assign(state.preferences, updates);
                }
            });
            try {
                await apiClient.patch('/settings/preferences', updates);
            } catch (error) {
                console.error("Failed to update preferences", error);
                // Here you might want to revert the state or show an error
            }
        },
    }))
);
