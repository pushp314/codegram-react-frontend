// =============== src/pages/SearchPage.tsx ===============
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { FeedItemDTO, User } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { FeedItemCard } from '../components/feed/FeedItemCard';
import { UserAvatar } from '../components/ui/UserAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [type, setType] = useState(searchParams.get('type') || 'all');
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setSearchParams({ q: query, type });
        try {
            const { data } = await apiClient.get('/search', { params: { query, type } });
            setResults(data.results);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    }, [query, type, setSearchParams]);

    useEffect(() => {
        if (searchParams.get('q')) {
            handleSearch();
        }
    }, [handleSearch, searchParams]);

    const onTypeChange = (newType: string) => {
        setType(newType);
        setSearchParams({ q: query, type: newType });
    }

    const renderContent = () => {
        if (!results) return null;

        const allSections = [
            { type: 'users', data: results.users?.data },
            { type: 'snippets', data: results.snippets?.data },
            { type: 'docs', data: results.docs?.data },
            { type: 'bugs', data: results.bugs?.data },
        ];

        const sectionsToRender = type === 'all' 
            ? allSections 
            : allSections.filter(sec => sec.type === type);

        const renderedSections = sectionsToRender.map(section => {
            if (!section.data || section.data.length === 0) return null;

            return (
                <section key={section.type} className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 capitalize">{section.type}</h2>
                    {section.type === 'users' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.data.map((user: User) => (
                                <Link to={`/profile/${user.username}`} key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <UserAvatar user={user} size="md" />
                                    <div>
                                        <p className="font-bold">{user.name}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {section.data.map((item: FeedItemDTO) => (
                                <FeedItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </section>
            );
        });

        const hasResults = renderedSections.some(section => section !== null);

        return hasResults ? <>{renderedSections}</> : <p className="text-center text-gray-500 py-8">No results found for "{query}" in {type}.</p>;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Search</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2 mb-8">
                <Input 
                    value={query} 
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search for snippets, docs, users..."
                    className="flex-grow"
                />
                <Button type="submit">Search</Button>
            </form>

            {isLoading && <Spinner />}

            {results && (
                 <Tabs value={type} onValueChange={onTypeChange} className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="snippets">Snippets</TabsTrigger>
                        <TabsTrigger value="docs">Docs</TabsTrigger>
                        <TabsTrigger value="bugs">Bugs</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                    </TabsList>
                    <TabsContent value={type} className="mt-6">
                        {renderContent()}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};
