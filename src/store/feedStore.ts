// =============== src/store/feedStore.ts ===============
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
  resetFeed: () => void;
  updateItem: (itemId: string, updates: Partial<FeedItemDTO>) => void;
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
          state.items.push(...data);
          state.page = state.page + 1;
          state.hasMore = newHasMore;
          state.isLoading = false;
        });
      } catch (err) {
        set({ error: 'Failed to fetch feed.', isLoading: false });
      }
    },

    resetFeed: () => set({ items: [], page: 1, hasMore: true, error: null }),

    updateItem: (itemId, updates) => {
        set(state => {
            const itemIndex = state.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                // Directly mutate the draft state as immer intends
                Object.assign(state.items[itemIndex], updates);
            }
        });
    },
  }))
);
