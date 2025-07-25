import React, { useState } from 'react';
import { FeedItemDTO } from '../../types';
import { SnippetCard } from '../profile/SnippetCard';
import { useInteraction } from '../../hooks/useInteraction';
import { useAuthStore } from '../../store/authStore';
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
    handleBookmark,
  } = useInteraction(item);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (item.type !== 'snippet') return null;

  const snippetForCard = {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    tags: item.tags ?? [],
    code: item.content ?? '',
    language: item.language ?? 'plaintext',
    createdAt: item.createdAt,
    author: {
      id: item.author.id,
      username: item.author.username,
      avatar: item.author.avatar ?? undefined,
      name: item.author.name ?? undefined,
    },
    likesCount,
    commentsCount: item.commentsCount ?? 0,
    bookmarksCount,
    isLiked,
    isBookmarked,
  };

  return (
    <>
      <SnippetCard
        snippet={snippetForCard}
        onReport={() => setIsReportModalOpen(true)}
        onLike={handleLike}
        onBookmark={handleBookmark}
        currentUser={currentUser}
      />
      <ReportContentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentId={item.id}
        contentType={item.type}
      />
    </>
  );
};