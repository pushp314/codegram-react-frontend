// =============== src/components/notifications/NotificationItem.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '../../types';
import { UserAvatar } from '../ui/UserAvatar';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const getNotificationText = () => {
    switch (notification.type) {
      case 'LIKE':
        return <>liked your {notification.snippet ? 'snippet' : 'doc'}</>;
      case 'COMMENT':
        return <>commented on your {notification.snippet ? 'snippet' : 'doc'}</>;
      case 'FOLLOW':
        return <>started following you</>;
      default:
        return <>sent you a notification</>;
    }
  };

  const getLink = () => {
    if (notification.snippet) return `/snippets/${notification.snippet.id}`;
    if (notification.doc) return `/docs/${notification.doc.id}`;
    if (notification.type === 'FOLLOW') return `/profile/${notification.sender.username}`;
    return '#';
  };

  return (
    <Link to={getLink()} className={cn(
        "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
        !notification.read && "bg-sky-50 dark:bg-sky-900/30"
    )}>
        <UserAvatar user={notification.sender} size="md" />
        <div className="flex-1 text-sm">
            <p>
                <span className="font-semibold">{notification.sender.name || notification.sender.username}</span>
                {' '}{getNotificationText()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notification.createdAt)}</p>
        </div>
        {!notification.read && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full self-center" />}
    </Link>
  );
};
