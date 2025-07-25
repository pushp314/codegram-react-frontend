import React, { useEffect } from 'react';
import { useFeedStore } from '../store/feedStore';
import { Spinner } from '../components/ui/Spinner';
import { BugCard } from '../components/feed/BugCard';

export const BugPage: React.FC = () => {
    const { items, isLoading, hasMore, fetchBugs, resetFeed } = useFeedStore();

    useEffect(() => {
        fetchBugs();
        return () => {
            resetFeed();
        };
    }, [fetchBugs, resetFeed]);

    const bugItems = items.filter(item => item.type === 'bug');

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Bug Feed</h1>
            {bugItems.length > 0 && (
                <div className="space-y-8">
                    {bugItems.map(bug => (
                        <BugCard key={bug.id} bug={bug} />
                    ))}
                </div>
            )}
            {isLoading && <Spinner />}
            {!isLoading && bugItems.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-lg text-gray-500">No bugs available right now.</p>
                </div>
            )}
            {!hasMore && bugItems.length > 0 && (
                <p className="text-center text-gray-500 my-8">You've reached the end!</p>
            )}
        </div>
    );
};