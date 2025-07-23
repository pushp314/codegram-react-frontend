// =============== src/pages/DocDetailPage.tsx ===============
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Doc, FeedItemDTO } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { formatRelativeTime } from '../lib/utils';
import { Heart, MessageCircle, Bookmark, Tag, Edit, Trash2, Share2 } from 'lucide-react';
import { CommentSection } from '../components/comments/CommentSection';
import { marked } from 'marked';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { DeleteConfirmationModal } from '../components/shared/DeleteConfirmationModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const RelatedContent: React.FC<{ tags: string[], currentId: string }> = ({ tags, currentId }) => {
    const [related, setRelated] = useState<FeedItemDTO[]>([]);
    useEffect(() => {
        if (tags.length > 0) {
            apiClient.get('/search/related', { params: { tags: tags.join(','), limit: 3 } })
                .then(res => setRelated(res.data.results.filter((item: FeedItemDTO) => item.id !== currentId)));
        }
    }, [tags, currentId]);

    if (related.length === 0) return null;

    return (
        <Card className="mt-8">
            <CardHeader><CardTitle>Related Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {related.map(item => (
                    <Link to={`/${item.type}s/${item.id}`} key={item.id} className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">by @{item.author.username}</p>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
};

export const DocDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [doc, setDoc] = useState<Doc | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // State for interactions
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (id) {
            apiClient.get(`/docs/${id}`).then(res => {
                setDoc(res.data);
                setIsLiked(res.data.isLiked);
                setLikesCount(res.data.likesCount);
                setIsBookmarked(res.data.isBookmarked);
            }).catch(console.error);
        }
    }, [id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await apiClient.delete(`/docs/${id}`);
            navigate('/');
        } catch (error) {
            console.error("Failed to delete doc", error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    if (!doc) return <Spinner />;
    const isOwner = currentUser?.id === doc.author.id;

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mb-4 text-sm text-gray-500">
                    <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/public" className="hover:underline">Docs</Link> &gt; <span>{doc.title}</span>
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
                    <div className="p-6 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(doc.content) }} />
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
                                <Heart size={20} className={isLiked ? 'text-red-500 fill-current' : ''} />
                                <span>{likesCount}</span>
                            </button>
                            <a href="#comments" className="flex items-center gap-2 hover:text-sky-500">
                                <MessageCircle size={20} />
                                <span>{doc.commentsCount}</span>
                            </a>
                        </div>
                        <button className="flex items-center gap-2 hover:text-green-500">
                            <Bookmark size={20} className={isBookmarked ? 'text-green-500 fill-current' : ''} />
                            <span>{doc.bookmarksCount}</span>
                        </button>
                    </div>
                </div>
                <div id="comments">
                    <CommentSection contentId={{ docId: doc.id }} />
                </div>
                <RelatedContent tags={doc.tags} currentId={doc.id} />
            </div>
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} isDeleting={isDeleting} itemName="document" />
        </>
    );
};
