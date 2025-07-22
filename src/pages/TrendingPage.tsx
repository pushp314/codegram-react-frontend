// =============== src/pages/TrendingPage.tsx ===============
import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import { FeedItemDTO } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { FeedItemCard } from '../components/feed/FeedItemCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export const TrendingPage: React.FC = () => {
    const [trending, setTrending] = useState<{ snippets: FeedItemDTO[], docs: FeedItemDTO[], bugs: FeedItemDTO[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrending = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data } = await apiClient.get('/search/trending');
                setTrending(data.results);
            } catch (error) {
                console.error("Failed to fetch trending content", error);
                setError("Could not load trending content. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

    const snippets = trending?.snippets;
    const docs = trending?.docs;
    const bugs = trending?.bugs;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Trending Content</h1>
            <Tabs defaultValue="snippets" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="snippets">Snippets</TabsTrigger>
                    <TabsTrigger value="docs">Docs</TabsTrigger>
                    <TabsTrigger value="bugs">Bugs</TabsTrigger>
                </TabsList>
                <TabsContent value="snippets" className="mt-4">
                    {snippets && snippets.length > 0 ? (
                        <div className="space-y-6">
                            {snippets.map(item => <FeedItemCard key={item.id} item={item} />)}
                        </div>
                    ) : <p className="text-center text-gray-500 py-8">No trending snippets right now.</p>}
                </TabsContent>
                 <TabsContent value="docs" className="mt-4">
                    {docs && docs.length > 0 ? (
                        <div className="space-y-6">
                            {docs.map(item => <FeedItemCard key={item.id} item={item} />)}
                        </div>
                    ) : <p className="text-center text-gray-500 py-8">No trending docs right now.</p>}
                </TabsContent>
                 <TabsContent value="bugs" className="mt-4">
                    {bugs && bugs.length > 0 ? (
                        <div className="space-y-6">
                            {bugs.map(item => <FeedItemCard key={item.id} item={item} />)}
                        </div>
                    ) : <p className="text-center text-gray-500 py-8">No trending bugs right now.</p>}
                </TabsContent>
            </Tabs>
        </div>
    );
};
