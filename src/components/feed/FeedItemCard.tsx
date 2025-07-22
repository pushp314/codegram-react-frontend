// =============== src/components/feed/FeedItemCard.tsx ===============
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedItemDTO } from '../../types';
import { UserAvatar } from '../ui/UserAvatar';
import { formatRelativeTime } from '../../lib/utils';
import { SnippetCard } from './SnippetCard';
import { DocCard } from './DocCard';
import { BugCard } from './BugCard';
import { MessageCircle, Heart, Bookmark as BookmarkIcon, MoreHorizontal, Flag } from 'lucide-react';
import { Snippet, Doc, Bug } from '../../types';
import { useInteraction } from '../../hooks/useInteraction';
import { useAuthStore } from '../../store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu';
import { ReportContentModal } from '../moderation/ReportContentModal';

interface FeedItemCardProps {
  item: FeedItemDTO;
}

export const FeedItemCard: React.FC<FeedItemCardProps> = ({ item }) => {
  const { user: currentUser } = useAuthStore();
  const { 
    isLiked, 
    likesCount, 
    isBookmarked, 
    bookmarksCount, 
    handleLike, 
    handleBookmark 
  } = useInteraction(item);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isAuthor = currentUser?.id === item.author.id;

  const renderContent = () => {
    const contentLink = `/${item.type}s/${item.id}`;
    
    switch (item.type) {
      case 'snippet':
        return <Link to={contentLink}><SnippetCard snippet={item as Snippet} /></Link>;
      case 'doc':
         return <Link to={contentLink}><DocCard doc={item as Doc} /></Link>;
      case 'bug':
        return <Link to={contentLink}><BugCard bug={item as Bug} /></Link>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to={`/profile/${item.author.username}`}>
                <UserAvatar user={item.author} size="md" />
              </Link>
              <div className="ml-3">
                <Link to={`/profile/${item.author.username}`} className="font-semibold hover:underline">
                  {item.author.name || item.author.username}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
            {currentUser && !isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreHorizontal size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsReportModalOpen(true)}>
                    <Flag size={16} className="mr-2" /> Report Content
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        {renderContent()}

        <div className="p-4 flex justify-between items-center text-gray-500 dark:text-gray-400">
          <div className="flex gap-4">
              <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition-colors">
                  <Heart size={20} className={isLiked ? 'text-red-500 fill-current' : ''} />
                  <span>{likesCount}</span>
              </button>
              <Link to={`/${item.type}s/${item.id}#comments`} className="flex items-center gap-2 hover:text-sky-500 transition-colors">
                  <MessageCircle size={20} />
                  <span>{item.commentsCount}</span>
              </Link>
          </div>
          <button onClick={handleBookmark} className="flex items-center gap-2 hover:text-green-500 transition-colors">
              <BookmarkIcon size={20} className={isBookmarked ? 'text-green-500 fill-current' : ''} />
              <span>{bookmarksCount}</span>
          </button>
        </div>
      </div>
      <ReportContentModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentId={item.id}
        contentType={item.type}
      />
    </>
  );
};
