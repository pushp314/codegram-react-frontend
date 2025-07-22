// =============== src/components/comments/CommentItem.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { Comment as CommentType } from '../../types';
import { UserAvatar } from '../ui/UserAvatar';
import { formatRelativeTime } from '../../lib/utils';

interface CommentItemProps {
  comment: CommentType;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4">
      <Link to={`/profile/${comment.author.username}`}>
        <UserAvatar user={comment.author} size="md" />
      </Link>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${comment.author.username}`} className="font-semibold hover:underline">
              {comment.author.name || comment.author.username}
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-1">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};
