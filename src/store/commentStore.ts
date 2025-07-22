// =============== src/store/commentStore.ts ===============
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { apiClient } from '../lib/apiClient';
import { Comment } from '../types';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchComments: (contentId: { snippetId?: string; docId?: string; bugId?: string }) => Promise<void>;
  addComment: (commentData: { content: string; snippetId?: string; docId?: string; bugId?: string }) => Promise<void>;
}

export const useCommentStore = create(
  immer<CommentState>((set) => ({
    comments: [],
    isLoading: false,
    error: null,
    fetchComments: async (contentId) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await apiClient.get('/comments', { params: contentId });
        set({ comments: data.comments, isLoading: false });
      } catch (err) {
        set({ error: 'Failed to fetch comments.', isLoading: false });
      }
    },
    addComment: async (commentData) => {
      try {
        const { data: newComment } = await apiClient.post<Comment>('/comments', commentData);
        set((state) => {
          state.comments.unshift(newComment);
        });
      } catch (err) {
        console.error('Failed to add comment', err);
        // Optionally set an error state to show in the UI
      }
    },
  }))
);
