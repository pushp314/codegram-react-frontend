// =============== src/pages/HomePage.tsx ===============
import { useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { Spinner } from '../components/ui/Spinner';
import { FeedItemCard } from '../components/feed/FeedItemCard';
import { FeedItemDTO } from '../types';

const fetchFeed = async ({ pageParam = 1 }) => {
    const { data } = await apiClient.get('/feed', {
        params: { page: pageParam, limit: 10 },
    });
    return data;
};

export function HomePage() {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: fetchFeed,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
    });

    const observer = useRef<IntersectionObserver>();
    const lastItemRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const feedItems = data?.pages.flatMap(page => page.data) ?? [];

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <p className="text-center text-red-500">Failed to load feed.</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Home Feed</h1>
            
            {feedItems.length > 0 ? (
                <div className="space-y-6">
                    {feedItems.map((item: FeedItemDTO, index) => (
                        <div key={`${item.type}-${item.id}`} ref={index === feedItems.length - 1 ? lastItemRef : null}>
                            <FeedItemCard item={item} />
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <p className="text-lg text-gray-500">Your feed is empty.</p>
                    <p className="text-gray-400 mt-2">Follow some users to see their content here.</p>
                </div>
            )}

            {isFetchingNextPage && <Spinner />}
            
            {!hasNextPage && feedItems.length > 0 && (
                <p className="text-center text-gray-500 my-8">You've reached the end!</p>
            )}
        </div>
    );
}
