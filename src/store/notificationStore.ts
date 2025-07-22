// =============== src/store/notificationStore.ts ===============
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { apiClient } from '../lib/apiClient';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create(
  immer<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    fetchNotifications: async () => {
      set({ isLoading: true });
      try {
        const { data } = await apiClient.get('/notifications');
        set({
          notifications: data.notifications,
          unreadCount: data.unreadCount,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        set({ isLoading: false });
      }
    },
    addNotification: (notification) => {
      set(state => {
        state.notifications.unshift(notification);
        state.unreadCount += 1;
      });
    },
    markAllAsRead: async () => {
      const currentUnreadCount = get().unreadCount;
      if (currentUnreadCount === 0) return;

      set(state => {
        state.unreadCount = 0;
        state.notifications.forEach(n => { n.read = true; });
      });
      try {
        await apiClient.post('/notifications/read');
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
        // Revert state on error
        set(state => {
            state.unreadCount = currentUnreadCount;
            // This part is complex, ideally re-fetch or handle more gracefully
        });
      }
    },
  }))
);
