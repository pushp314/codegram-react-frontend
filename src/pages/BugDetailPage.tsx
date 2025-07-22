// =============== src/pages/BugDetailPage.tsx ===============
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Bug } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatRelativeTime } from '../lib/utils';
import { Heart, MessageCircle, Bookmark, Tag } from 'lucide-react';
import { CommentSection } from '../components/comments/CommentSection';
import { marked } from 'marked';
import { useAuthStore } from '../store/authStore';

export const BugDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthStore();
    const [bug, setBug] = useState<Bug | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchBug = async () => {
            try {
                setIsLoading(true);
                if (currentUser) {
                    await apiClient.post(`/bugs/${id}/view`); // Record a view only if logged in
                }
                const { data } = await apiClient.get(`/bugs/${id}`);
                setBug(data);
            } catch (err) {
                setError('Failed to fetch bug report.');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchBug();
        }
    }, [id, currentUser]);

    const handleStatusChange = async (newStatus: string) => {
        if (!bug) return;
        setIsUpdatingStatus(true);
        try {
            const { data } = await apiClient.patch(`/bugs/${bug.id}/status`, { status: newStatus });
            setBug(data);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!bug) return <div className="text-center">Bug report not found or has expired.</div>;

    const isAuthor = currentUser?.id === bug.author.id;

    const getMarkdownText = () => {
        const rawMarkup = marked(bug.content);
        return { __html: rawMarkup };
    };

    const severityColors: { [key: string]: string } = {
        LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    const statusColors: { [key: string]: string } = {
        OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        RESOLVED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h1 className="text-4xl font-bold">{bug.title}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">{bug.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityColors[bug.severity]}`}>
                                {bug.severity}
                            </span>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[bug.status]}`}>
                                {bug.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <Link to={`/profile/${bug.author.username}`}>
                                <UserAvatar user={bug.author} size="md" />
                            </Link>
                            <div className="ml-3">
                                <Link to={`/profile/${bug.author.username}`} className="font-semibold hover:underline">
                                    {bug.author.name || bug.author.username}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Posted {formatRelativeTime(bug.createdAt)}
                                </p>
                            </div>
                        </div>
                        {isAuthor && (
                            <div className="flex items-center gap-2">
                                <select 
                                    value={bug.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={isUpdatingStatus}
                                    className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={getMarkdownText()} />

                <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
                    {bug.tags.map(tag => (
                        <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                           <Tag size={12} className="mr-1" /> {tag}
                        </span>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 hover:text-red-500">
                            <Heart size={20} className={bug.isLiked ? 'text-red-500 fill-current' : ''} />
                            <span>{bug.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-sky-500">
                            <MessageCircle size={20} />
                            <span>{bug.commentsCount}</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 hover:text-green-500">
                        <Bookmark size={20} className={bug.isBookmarked ? 'text-green-500 fill-current' : ''} />
                        <span>{bug.bookmarksCount}</span>
                    </button>
                </div>
            </div>
            <CommentSection contentId={{ bugId: bug.id }} />
        </div>
    );
};
