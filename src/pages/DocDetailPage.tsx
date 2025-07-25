import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatRelativeTime } from '../lib/utils';
import { Heart, MessageCircle, Bookmark, Tag, Edit, Trash2, Share2 } from 'lucide-react';
import { CommentSection } from '../components/comments/CommentSection';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { DeleteConfirmationModal } from '../components/shared/DeleteConfirmationModal';
import ReactMarkdown from 'react-markdown';

export const DocDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [doc, setDoc] = useState<Doc | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    function showError(msg: string) {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(null), 4000);
    }

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarksCount, setBookmarksCount] = useState(0);

    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (id) {
            apiClient.get(`/docs/${id}`)
                .then(res => {
                    setDoc(res.data);
                    setIsLiked(res.data.isLiked);
                    setLikesCount(res.data.likesCount);
                    setIsBookmarked(res.data.isBookmarked);
                    setBookmarksCount(res.data.bookmarksCount);
                })
                .catch(() => showError('Failed to load document'));
        }
    }, [id]);

    const handleLike = async () => {
        if (!doc) return;
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);
        try {
            await apiClient.post('/likes', { docId: doc.id });
            const res = await apiClient.get(`/docs/${doc.id}`);
            setIsLiked(res.data.isLiked);
            setLikesCount(res.data.likesCount);
        } catch (error) {
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => !isLiked ? prev + 1 : prev - 1);
            showError('Failed to like document');
        }
    };

    const handleBookmark = async () => {
        if (!doc) return;
        setIsBookmarked((prev) => !prev);
        setBookmarksCount((prev) => isBookmarked ? prev - 1 : prev + 1);
        try {
            await apiClient.post('/bookmarks', { docId: doc.id });
            const res = await apiClient.get(`/docs/${doc.id}`);
            setIsBookmarked(res.data.isBookmarked);
            setBookmarksCount(res.data.bookmarksCount);
        } catch (error) {
            setIsBookmarked((prev) => !prev);
            setBookmarksCount((prev) => !isBookmarked ? prev + 1 : prev - 1);
            showError('Failed to bookmark document');
        }
    };

    useEffect(() => {
        if (doc && currentUser && doc.author.id !== currentUser.id) {
            apiClient.get(`/follows/check/${doc.author.id}`)
                .then(res => setIsFollowing(res.data.following))
                .catch(() => setIsFollowing(false));
        }
    }, [doc, currentUser]);

    const handleFollowToggle = async () => {
        if (!doc) return;
        setFollowLoading(true);
        try {
            await apiClient.post(`/follows/${doc.author.id}`);
            const res = await apiClient.get(`/follows/check/${doc.author.id}`);
            setIsFollowing(res.data.following);
        } catch (error) {
            showError('Failed to follow/unfollow user');
        }
        setFollowLoading(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await apiClient.delete(`/docs/${id}`);
            navigate('/docs');
        } catch (error) {
            showError('Failed to delete doc');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (!doc) return <Spinner />;
    const isOwner = currentUser?.id === doc.author.id;

    return (
        <>
            {errorMsg && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 text-center">
                    {errorMsg}
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                <div className="mb-4 text-sm text-gray-500">
                    <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/docs" className="hover:underline">Docs</Link> &gt; <span>{doc.title}</span>
                </div>
                {doc.coverImage && <img src={doc.coverImage} alt={doc.title} className="w-full h-64 object-cover rounded-t-lg" />}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="p-6">
                        <h1 className="text-4xl font-bold">{doc.title}</h1>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <UserAvatar user={doc.author} size="md" />
                                <div className="ml-3">
                                    <Link to={`/profile/${doc.author.username}`} className="font-semibold hover:underline">{doc.author.name || doc.author.username}</Link>
                                    <p className="text-sm text-gray-500">Posted {formatRelativeTime(doc.createdAt)}</p>
                                </div>
                                {(!isOwner && (
                                    <Button
                                        size="sm"
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        className={`ml-6 ${isFollowing ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                {isOwner && (
                                    <>
                                        <Link to={`/docs/${id}/edit`}><Button variant="outline" size="sm"><Edit size={16} className="mr-2" /> Edit</Button></Link>
                                        <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}><Trash2 size={16} className="mr-2" /> Delete</Button>
                                    </>
                                )}
                                <Button variant="ghost" size="sm"><Share2 size={16} /></Button>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{doc.content}</ReactMarkdown>
                    </div>
                    <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
                        {doc.tags.map(tag => (
                            <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                <Tag size={12} className="mr-1" /> {tag}
                            </span>
                        ))}
                    </div>
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 hover:text-red-500" onClick={handleLike}>
                                <Heart size={20} className={isLiked ? 'text-red-500 fill-current' : ''} />
                                <span>{likesCount}</span>
                            </button>
                            <a href="#comments" className="flex items-center gap-2 hover:text-sky-500">
                                <MessageCircle size={20} />
                                <span>{doc.commentsCount}</span>
                            </a>
                        </div>
                        <button className="flex items-center gap-2 hover:text-green-500" onClick={handleBookmark}>
                            <Bookmark size={20} className={isBookmarked ? 'text-green-500 fill-current' : ''} />
                            <span>{bookmarksCount}</span>
                        </button>
                    </div>
                </div>
                <div id="comments">
                    <CommentSection contentId={{ docId: doc.id }} />
                </div>
            </div>
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} isDeleting={isDeleting} itemName="document" />
        </>
    );
};