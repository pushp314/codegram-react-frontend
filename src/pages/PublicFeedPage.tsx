import React, { useEffect } from 'react';
import { useFeedStore } from '../store/feedStore';
import { Spinner } from '../components/ui/Spinner';
import { SnippetCard } from '../components/profile/SnippetCard';

export const PublicFeedPage: React.FC = () => {
    const { items, isLoading, hasMore, fetchFeed, resetFeed } = useFeedStore();

    useEffect(() => {
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

    // Only show snippet items, and map to have .code and safe description, safe avatar, and safe name
    const snippetItems = items
        .filter(item => item.type === 'snippet')
        .map(snippet => ({
            ...snippet,
            code: snippet.content ?? '',
            description: snippet.description ?? '',
            author: {
                ...snippet.author,
                avatar: snippet.author.avatar ?? undefined,
                name: snippet.author.name ?? undefined,
            },
        }));

    return (
        <div className="max-w-2xl mx-auto" onScroll={handleScroll}>
            <h1 className="text-2xl font-bold mb-4">Public Feed</h1>
            
            {snippetItems.length > 0 && (
                <div className="space-y-8">
                    {snippetItems.map(snippet => (
                        <SnippetCard
                            key={snippet.id}
                            snippet={snippet}
                        />
                    ))}
                </div>
            )}

            {isLoading && <Spinner />}

            {!isLoading && snippetItems.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-lg text-gray-500">No public snippets available right now.</p>
                </div>
            )}

            {!hasMore && snippetItems.length > 0 && (
                <p className="text-center text-gray-500 my-8">You've reached the end!</p>
            )}
        </div>
    );
};