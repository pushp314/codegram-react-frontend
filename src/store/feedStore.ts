import { create } from 'zustand';
import { apiClient as apiFeed } from '../lib/apiClient';
import { FeedItemDTO } from '../types';
import { immer } from 'zustand/middleware/immer';

interface FeedState {
  items: FeedItemDTO[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  fetchBugs: () => Promise<void>;
  resetFeed: () => void;
  updateItem: (itemId: string, updates: Partial<FeedItemDTO>) => void;
  addFeedItem: (item: FeedItemDTO) => void;
}

export const useFeedStore = create(
  immer<FeedState>((set, get) => ({
    items: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
    
    fetchFeed: async () => {
      const { page, hasMore, isLoading } = get();
      if (!hasMore || isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const response = await apiFeed.get('/feed', {
          params: { page, limit: 10 },
        });
        const { data, hasMore: newHasMore } = response.data;
        
        set((state) => {
          // Avoid adding duplicate items
          const existingIds = new Set(state.items.map(item => item.id));
          const newItems = data.filter((item: FeedItemDTO) => !existingIds.has(item.id));
          state.items.push(...newItems);
          state.page = state.page + 1;
          state.hasMore = newHasMore;
          state.isLoading = false;
        });
      } catch (err) {
        set({ error: 'Failed to fetch feed.', isLoading: false });
      }
    },

    fetchBugs: async () => {
      const { page, hasMore, isLoading } = get();
      if (!hasMore || isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const response = await apiFeed.get('/feed', {
          params: { page, limit: 10, type: 'bug' }, // Only fetch bugs
        });
        const { data, hasMore: newHasMore } = response.data;
        
        set((state) => {
          // Avoid adding duplicate items
          const existingIds = new Set(state.items.map(item => item.id));
          const newItems = data.filter((item: FeedItemDTO) => !existingIds.has(item.id));
          state.items.push(...newItems);
          state.page = state.page + 1;
          state.hasMore = newHasMore;
          state.isLoading = false;
        });
      } catch (err) {
        set({ error: 'Failed to fetch bugs.', isLoading: false });
      }
    },

    resetFeed: () => set({ items: [], page: 1, hasMore: true, error: null }),

    updateItem: (itemId, updates) => {
        set(state => {
            const itemIndex = state.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                Object.assign(state.items[itemIndex], updates);
            }
        });
    },

    addFeedItem: (item) => {
        set(state => {
            if (!state.items.some(existingItem => existingItem.id === item.id)) {
                state.items.unshift(item);
            }
        });
    },
  }))
);