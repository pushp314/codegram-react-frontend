import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash, Bookmark, Flag, UserMinus, UserPlus, Share2, MessageCircle, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { apiClient } from '../../lib/apiClient';
import { useNavigate } from 'react-router-dom';

export type SnippetCardProps = {
  snippet: {
    id: string;
    title: string;
    description: string;
    tags?: string[];
    code: string;
    language: string;
    previewCode?: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      avatar?: string;
      name?: string;
    };
    likesCount: number;
    commentsCount: number;
    sharesCount?: number;
    bookmarksCount?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onReport?: () => void;
  onUnfollow?: () => void;
  onBookmark?: () => void;
  onFollow?: () => void;
  currentUser?: any;
  isFollowed?: boolean;

};

function SnippetPreview({ code, language }: { code: string; language: string }) {
  if (language === 'html') {
    return (
      <div className="bg-white rounded-lg p-4 min-h-[220px]">
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg p-4 min-h-[220px] flex items-center justify-center text-gray-400">
      Preview not available.
    </div>
  );
}

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onShare,
  onReport,
  onUnfollow,
  onFollow,
  isFollowed,
  onBookmark,
}: SnippetCardProps) {
  const currentUser = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = currentUser?.id === snippet.author.id;

  // Like/Bookmark state
  const [isLiked, setIsLiked] = useState(!!snippet.isLiked);
  const [likesCount, setLikesCount] = useState(snippet.likesCount || 0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(!!snippet.isBookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(snippet.bookmarksCount || 0);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Close menu on outside click/Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Like
  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    setError(null);
    try {
      const res = await apiClient.post('/likes', { snippetId: snippet.id });
      setIsLiked(res.data.liked);
      setLikesCount(prev => prev + (res.data.liked ? 1 : -1));
    } catch {
      setError('Failed to toggle like');
    }
    setLoadingLike(false);
  };

  // Bookmark (updated logic)
  const handleBookmark = async () => {
    if (loadingBookmark) return;
    setLoadingBookmark(true);
    setError(null);
    try {
      // Use correct API endpoint to toggle bookmark
      const res = await apiClient.post('/bookmarks', { snippetId: snippet.id });
      setIsBookmarked(res.data.bookmarked);
      setBookmarksCount(prev => prev + (res.data.bookmarked ? 1 : -1));
      onBookmark?.();
    } catch {
      setError('Failed to toggle bookmark');
    }
    setLoadingBookmark(false);
  };

  // Delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    setLoadingDelete(true);
    setError(null);
    try {
      await apiClient.delete(`/snippets/${snippet.id}`);
      onDelete?.();
    } catch {
      setError('Failed to delete snippet');
    }
    setLoadingDelete(false);
  };

  // Comments navigation
  const handleCommentsClick = () => {
    navigate(`/snippets/${snippet.id}#comments`);
  };

  return (
    <div className="rounded-xl bg-[#19202c] border border-[#232c3b] shadow-sm mb-8 overflow-hidden">
      {/* Header: Profile + Menu */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={snippet.author.avatar || '/default-avatar.png'}
            alt={snippet.author.username}
            className="w-10 h-10 rounded-full border border-[#232c3b]"
          />
          <div>
            <div className="font-semibold text-white">{snippet.author.name ?? snippet.author.username}</div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            className="text-gray-400 hover:text-gray-200 p-2 rounded-full transition"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Show menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 z-10 bg-[#232c3b] shadow-lg rounded w-44 text-sm py-1" role="menu">
              {isAuthor ? (
                <>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onEdit}>
                    <Edit size={16} className="mr-2" /> Edit
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={handleDelete} disabled={loadingDelete}>
                    <Trash size={16} className="mr-2" /> {loadingDelete ? 'Deleting...' : 'Delete'}
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={handleBookmark} disabled={loadingBookmark}>
                    <Bookmark size={16} className="mr-2" /> {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onReport}>
                    <Flag size={16} className="mr-2" /> Report
                  </button>
                  {isFollowed && (
                    <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onUnfollow}>
                      <UserMinus size={16} className="mr-2" /> Unfollow
                    </button>
                  )}
                  {!isFollowed && (
                    <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onFollow}>
                      <UserPlus size={16} className="mr-2" /> Follow
                    </button>
                  )}
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={handleBookmark} disabled={loadingBookmark}>
                    <Bookmark size={16} className="mr-2" /> {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="px-5 flex gap-4 mb-2">
        <button
          className={clsx(
            "py-1 px-3 rounded bg-transparent text-sm font-medium",
            tab === 'preview'
              ? "text-[#3da9fc] bg-[#232c3b]"
              : "text-gray-400 hover:text-[#3da9fc]"
          )}
          onClick={() => setTab('preview')}
          aria-pressed={tab === 'preview'}
        >
          ▶ Preview
        </button>
        <button
          className={clsx(
            "py-1 px-3 rounded bg-transparent text-sm font-medium",
            tab === 'code'
              ? "text-[#3da9fc] bg-[#232c3b]"
              : "text-gray-400 hover:text-[#3da9fc]"
          )}
          onClick={() => setTab('code')}
          aria-pressed={tab === 'code'}
        >
          <span className="inline-block align-middle mr-1">&lt;/&gt;</span> Code
        </button>
      </div>
      {/* Preview/Code Content */}
      <div className="px-5 pb-2">
        {tab === 'preview' ? (
          <SnippetPreview code={snippet.previewCode || snippet.code} language={snippet.language} />
        ) : (
          <div className="bg-[#111827] rounded-lg p-4 min-h-[220px] overflow-auto font-mono text-sm text-gray-100">
            <pre>
              <code>{snippet.code}</code>
            </pre>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center px-5 py-2 gap-6 border-b border-[#232c3b]">
        <button
          className={clsx("flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition", isLiked && "text-[#3da9fc] font-semibold")}
          onClick={handleLike}
          disabled={loadingLike}
          aria-pressed={isLiked}
        >
          <Heart size={19} className="mr-1" /> {likesCount}
        </button>
        <button
          className="flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition"
          onClick={handleCommentsClick}
        >
          <MessageCircle size={19} className="mr-1" /> {snippet.commentsCount}
        </button>
        <button
          className="flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition"
          onClick={onShare}
        >
          <Share2 size={19} className="mr-1" /> Share
        </button>
        <button
          className={clsx("ml-auto", isBookmarked ? "text-[#3da9fc]" : "text-gray-400 hover:text-[#3da9fc]")}
          onClick={handleBookmark}
          disabled={loadingBookmark}
          aria-pressed={isBookmarked}
        >
          <Bookmark size={22} /> {bookmarksCount}
        </button>
      </div>
      {/* Info: Title, Description, Tags */}
      <div className="px-5 py-4">
        <div className="font-bold text-white mb-1">{snippet.title}</div>
        <div className="text-gray-300 mb-1">{snippet.description}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {snippet.tags?.map(tag => (
            <span key={tag} className="text-xs text-[#3da9fc] bg-[#232c3b] rounded px-2 py-1">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="px-5 pb-4">
        <button
          className="text-sm text-[#3da9fc] cursor-pointer hover:underline bg-transparent border-none"
          onClick={handleCommentsClick}
          type="button"
        >
          View all {snippet.commentsCount} comments
        </button>
      </div>
      {error && <div className="px-5 pb-2 text-red-500">{error}</div>}
    </div>
  );
}