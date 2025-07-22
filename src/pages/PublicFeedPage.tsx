// =============== src/pages/PublicFeedPage.tsx ===============
import React, { useEffect } from 'react';
import { useFeedStore } from '../store/feedStore';
import { Spinner } from '../components/ui/Spinner';
import { FeedItemCard } from '../components/feed/FeedItemCard';

export const PublicFeedPage: React.FC = () => {
    const { items, isLoading, hasMore, fetchFeed, resetFeed } = useFeedStore();

    useEffect(() => {
        // We can adapt useFeedStore later to accept a URL, for now it defaults to personal feed
        // For a real public feed, we'd have a separate store or logic to hit `/feed/public`
        fetchFeed();
        return () => {
            resetFeed();
        };
    }, [fetchFeed, resetFeed]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
            fetchFeed();
        }
    };

    return (
        <div className="max-w-2xl mx-auto" onScroll={handleScroll}>
            <h1 className="text-2xl font-bold mb-4">Public Feed</h1>
            
            {items.length > 0 && (
                <div className="space-y-6">
                    {items.map(item => (
                        <FeedItemCard key={`${item.type}-${item.id}`} item={item} />
                    ))}
                </div>
            )}

            {isLoading && <Spinner />}

            {!isLoading && items.length === 0 && (
                 <div className="text-center py-16">
                    <p className="text-lg text-gray-500">No public content available right now.</p>
                </div>
            )}
            
            {!hasMore && items.length > 0 && (
                <p className="text-center text-gray-500 my-8">You've reached the end!</p>
            )}
        </div>
    );
};
