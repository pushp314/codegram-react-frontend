import { useState } from 'react';
import { MoreVertical, Edit, Trash, Bookmark, Flag, UserMinus, UserPlus, Share2, MessageCircle, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export type SnippetCardProps = {
  snippet: {
    id: string;
    title: string;
    description: string;
    tags?: string[];
    code: string;
    language: 'html' | 'react' | 'js' | string;
    previewCode?: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      avatar?: string;
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
  onBookmark?: () => void;
  onUnbookmark?: () => void;
  onReport?: () => void;
  onShare?: () => void;
  onUnfollow?: () => void;
  onFollow?: () => void;
  isFollowed?: boolean;
};

function SnippetPreview({ code, language }: { code: string, language: string }) {
  if (language === 'html') {
    return (
      <div className="bg-white rounded-lg p-4 min-h-[220px]">
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    );
  }
  // Placeholder for React/JS previews
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
  onBookmark,
  onUnbookmark,
  onReport,
  onShare,
  onUnfollow,
  onFollow,
  isFollowed,
}: SnippetCardProps) {
  const currentUser = useAuthStore(s => s.user);
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const isAuthor = currentUser?.id === snippet.author.id;

  return (
    <div className="rounded-xl bg-[#19202c] border border-[#232c3b] shadow-sm mb-8 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={snippet.author.avatar || '/default-avatar.png'}
            alt={snippet.author.username}
            className="w-10 h-10 rounded-full border border-[#232c3b]"
          />
          <div>
            <div className="font-semibold text-white">{snippet.author.username}</div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-200 p-2 rounded-full transition"
            onClick={() => setShowMenu(v => !v)}
            aria-label="Show menu"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 z-10 bg-[#232c3b] shadow-lg rounded w-44 text-sm py-1">
              {isAuthor ? (
                <>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onEdit}>
                    <Edit size={16} className="mr-2" /> Edit
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={onDelete}>
                    <Trash size={16} className="mr-2" /> Delete
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={snippet.isBookmarked ? onUnbookmark : onBookmark}>
                    <Bookmark size={16} className="mr-2" /> {snippet.isBookmarked ? 'Saved' : 'Save'}
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
                  <button className="flex items-center w-full px-4 py-2 hover:bg-[#222b3a] text-white" onClick={snippet.isBookmarked ? onUnbookmark : onBookmark}>
                    <Bookmark size={16} className="mr-2" /> {snippet.isBookmarked ? 'Saved' : 'Save'}
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
        <button className={clsx("flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition", snippet.isLiked && "text-[#3da9fc] font-semibold")}>
          <Heart size={19} className="mr-1" /> {snippet.likesCount}
        </button>
        <button className="flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition">
          <MessageCircle size={19} className="mr-1" /> {snippet.commentsCount}
        </button>
        <button
          className="flex items-center gap-1 text-gray-400 hover:text-[#3da9fc] transition"
          onClick={onShare}
        >
          <Share2 size={19} className="mr-1" /> Share
        </button>
        <button className={clsx("ml-auto", snippet.isBookmarked ? "text-[#3da9fc]" : "text-gray-400 hover:text-[#3da9fc]")}>
          <Bookmark size={22} />
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
      <div className="px-5 pb-4 text-sm text-[#3da9fc] cursor-pointer hover:underline">
        View all {snippet.commentsCount} comments
      </div>
    </div>
  );
}