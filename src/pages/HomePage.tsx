// =============== src/pages/HomePage.tsx ===============
import React, { useEffect } from 'react';
import { useFeedStore as useFeedStoreHome } from '../store/feedStore';
import { Spinner as SpinnerHomePage } from '../components/ui/Spinner';
import { FeedItemCard as FeedItemCardHome } from '../components/feed/FeedItemCard';

export function HomePage() {
    const { items, isLoading, hasMore, fetchFeed, resetFeed } = useFeedStoreHome();

    useEffect(() => {
        // Fetch initial feed items
        if (items.length === 0) {
            fetchFeed();
        }

        // Reset feed when component unmounts
        return () => {
            resetFeed();
        };
    }, [fetchFeed, resetFeed]);

    // Simple scroll handler for infinite loading
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            if (!isLoading && hasMore) {
                fetchFeed();
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto" onScroll={handleScroll}>
            <h1 className="text-2xl font-bold mb-4">Home Feed</h1>
            
            {items.length > 0 && (
                <div className="space-y-6">
                    {items.map(item => (
                        <FeedItemCardHome key={`${item.type}-${item.id}`} item={item} />
                    ))}
                </div>
            )}

            {isLoading && <SpinnerHomePage />}

            {!isLoading && items.length === 0 && (
                 <div className="text-center py-16">
                    <p className="text-lg text-gray-500">Your feed is empty.</p>
                    <p className="text-gray-400 mt-2">Follow some users to see their content here.</p>
                </div>
            )}
            
            {!hasMore && items.length > 0 && (
                <p className="text-center text-gray-500 my-8">You've reached the end!</p>
            )}
        </div>
    );
}
