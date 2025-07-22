// =============== src/pages/DocDetailPage.tsx ===============
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatRelativeTime } from '../lib/utils';
import { Heart, MessageCircle, Bookmark, Tag } from 'lucide-react';
import { CommentSection } from '../components/comments/CommentSection';
import { marked } from 'marked';

export const DocDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [doc, setDoc] = useState<Doc | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                setIsLoading(true);
                const { data } = await apiClient.get(`/docs/${id}`);
                setDoc(data);
            } catch (err) {
                setError('Failed to fetch document.');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchDoc();
        }
    }, [id]);

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!doc) return <div className="text-center">Document not found.</div>;

    const getMarkdownText = () => {
        const rawMarkup = marked(doc.content);
        return { __html: rawMarkup };
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl font-bold">{doc.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{doc.description}</p>
                    <div className="flex items-center mt-4">
                        <Link to={`/profile/${doc.author.username}`}>
                            <UserAvatar user={doc.author} size="md" />
                        </Link>
                        <div className="ml-3">
                            <Link to={`/profile/${doc.author.username}`} className="font-semibold hover:underline">
                                {doc.author.name || doc.author.username}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Posted {formatRelativeTime(doc.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={getMarkdownText()} />

                <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
                    {doc.tags.map(tag => (
                        <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                           <Tag size={12} className="mr-1" /> {tag}
                        </span>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 hover:text-red-500">
                            <Heart size={20} className={doc.isLiked ? 'text-red-500 fill-current' : ''} />
                            <span>{doc.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-sky-500">
                            <MessageCircle size={20} />
                            <span>{doc.commentsCount}</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 hover:text-green-500">
                        <Bookmark size={20} className={doc.isBookmarked ? 'text-green-500 fill-current' : ''} />
                        <span>{doc.bookmarksCount}</span>
                    </button>
                </div>
            </div>
            <CommentSection contentId={{ docId: doc.id }} />
        </div>
    );
};
