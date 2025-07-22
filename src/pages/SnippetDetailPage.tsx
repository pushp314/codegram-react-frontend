// =============== src/pages/SnippetDetailPage.tsx ===============
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { apiClient } from '../lib/apiClient';
import { Snippet } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatRelativeTime } from '../lib/utils';
import { Heart, MessageCircle, Bookmark, Tag } from 'lucide-react';
import { CommentSection } from '../components/comments/CommentSection';

export const SnippetDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                setIsLoading(true);
                const { data } = await apiClient.get(`/snippets/${id}`);
                setSnippet(data);
            } catch (err) {
                setError('Failed to fetch snippet.');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchSnippet();
        }
    }, [id]);

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!snippet) return <div className="text-center">Snippet not found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold">{snippet.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{snippet.description}</p>
                    <div className="flex items-center mt-4">
                        <Link to={`/profile/${snippet.author.username}`}>
                            <UserAvatar user={snippet.author} size="md" />
                        </Link>
                        <div className="ml-3">
                            <Link to={`/profile/${snippet.author.username}`} className="font-semibold hover:underline">
                                {snippet.author.name || snippet.author.username}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Posted {formatRelativeTime(snippet.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Editor
                            height="500px"
                            language={snippet.language.toLowerCase()}
                            value={snippet.content}
                            theme="vs-dark"
                            options={{ readOnly: true, minimap: { enabled: false } }}
                        />
                    </div>
                </div>

                <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
                    {snippet.tags.map(tag => (
                        <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                           <Tag size={12} className="mr-1" /> {tag}
                        </span>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 hover:text-red-500">
                            <Heart size={20} className={snippet.isLiked ? 'text-red-500 fill-current' : ''} />
                            <span>{snippet.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-sky-500">
                            <MessageCircle size={20} />
                            <span>{snippet.commentsCount}</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 hover:text-green-500">
                        <Bookmark size={20} className={snippet.isBookmarked ? 'text-green-500 fill-current' : ''} />
                        <span>{snippet.bookmarksCount}</span>
                    </button>
                </div>
            </div>
            <CommentSection contentId={{ snippetId: snippet.id }} />
        </div>
    );
};
