// =============== src/hooks/useInteraction.ts ===============
import { useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { useFeedStore } from '../store/feedStore';
import { FeedItemDTO } from '../types';

export const useInteraction = (item: FeedItemDTO) => {
    const updateItemInStore = useFeedStore((state) => state.updateItem);

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [likesCount, setLikesCount] = useState(item.likesCount);
    const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
    const [bookmarksCount, setBookmarksCount] = useState(item.bookmarksCount);

    const handleLike = async () => {
        // Optimistic UI update
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        try {
            const payload = { [`${item.type}Id`]: item.id };
            await apiClient.post('/likes', payload);
            // Sync with global store on success
            updateItemInStore(item.id, { 
                isLiked: !isLiked,
                likesCount: isLiked ? likesCount - 1 : likesCount + 1
            });
        } catch (error) {
            // Revert on error
            setIsLiked(isLiked);
            setLikesCount(likesCount);
            console.error('Failed to toggle like:', error);
        }
    };

    const handleBookmark = async () => {
        // Optimistic UI update
        setIsBookmarked(!isBookmarked);
        setBookmarksCount(isBookmarked ? bookmarksCount - 1 : bookmarksCount + 1);

        try {
            const payload = { [`${item.type}Id`]: item.id };
            await apiClient.post('/bookmarks', payload);
             // Sync with global store on success
            updateItemInStore(item.id, {
                isBookmarked: !isBookmarked,
                bookmarksCount: isBookmarked ? bookmarksCount - 1 : bookmarksCount + 1
            });
        } catch (error) {
            // Revert on error
            setIsBookmarked(isBookmarked);
            setBookmarksCount(bookmarksCount);
            console.error('Failed to toggle bookmark:', error);
        }
    };

    return {
        isLiked,
        likesCount,
        isBookmarked,
        bookmarksCount,
        handleLike,
        handleBookmark,
    };
};
