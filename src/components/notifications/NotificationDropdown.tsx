// =============== src/components/notifications/NotificationDropdown.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
// Removed unused DropdownMenuItem import
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/DropdownMenu';
import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Button } from '../ui/Button';

export const NotificationDropdown: React.FC = () => {
    const { notifications, unreadCount, markAllAsRead } = useNotificationStore();

    return (
        <DropdownMenu onOpenChange={(open) => { if (open) markAllAsRead(); }}>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Bell />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-semibold">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                    ) : (
                        <p className="p-4 text-center text-sm text-gray-500">No new notifications.</p>
                    )}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <Link to="/notifications">
                        <Button variant="link" className="w-full">View all notifications</Button>
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
