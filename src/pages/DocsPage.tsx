import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { Link } from 'react-router-dom';
import { Doc } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { formatRelativeTime } from '../lib/utils';
import { Tag } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';

export const DocsPage: React.FC = () => {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    useEffect(() => {
        apiClient.get('/docs')
            .then(res => setDocs(res.data.docs || res.data))
            .catch(() => setErrorMsg('Failed to load documentation.'))
            .finally(() => setLoading(false));
    }, []);

    // Compute list of all tags
    const allTags = Array.from(
        new Set(
            docs.flatMap(doc => doc.tags || [])
        )
    );

    // Filter docs by tag
    const filteredDocs = tagFilter
        ? docs.filter(doc => doc.tags?.includes(tagFilter))
        : docs;

    if (loading) return <Spinner />;

    return (
        <div className="max-w-5xl mx-auto py-8">
            {errorMsg && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 text-center">
                    {errorMsg}
                </div>
            )}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Documentation Hub</h1>
                <p className="text-gray-500">Comprehensive guides, tutorials, and documentation created by developers, for developers.</p>
            </div>
            <div className="mb-4 flex flex-wrap gap-3">
                <button
                    className={`py-1 px-3 rounded ${!tagFilter ? 'bg-gray-200 dark:bg-gray-700 text-sky-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                    onClick={() => setTagFilter(null)}
                >
                    All Categories
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        className={`py-1 px-3 rounded ${tagFilter === tag ? 'bg-sky-100 dark:bg-sky-900 text-sky-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                        onClick={() => setTagFilter(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <div className="space-y-6">
                {filteredDocs.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No documentation found. Be the first to publish!</div>
                )}
                {filteredDocs.map(doc => (
                    <Link key={doc.id} to={`/docs/${doc.id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{doc.title}</h2>
                                <p className="text-gray-500 mb-2">{doc.description}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {doc.tags?.map(tag => (
                                        <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                            <Tag size={12} className="mr-1" /> {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mb-0">
                                    Posted {formatRelativeTime(doc.createdAt)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end ml-6 min-w-[120px]">
                                <div className="flex items-center mb-1">
                                    <UserAvatar user={doc.author} size="sm" />
                                    <Link to={`/profile/${doc.author.username}`} className="ml-2 font-semibold hover:underline">
                                        {doc.author.name || doc.author.username}
                                    </Link>
                                </div>
                                <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span title="Likes">❤️ {doc.likesCount}</span>
                                    <span title="Bookmarks">🔖 {doc.bookmarksCount}</span>
                                    <span title="Comments">💬 {doc.commentsCount}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};