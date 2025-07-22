// =============== src/pages/NotificationsPage.tsx ===============
import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { Spinner } from '../components/ui/Spinner';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const NotificationsPage: React.FC = () => {
    const { notifications, isLoading, fetchNotifications } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Spinner /> : (
                        <div className="space-y-2">
                            {notifications.length > 0 ? (
                                notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                            ) : (
                                <p className="text-center text-gray-500 py-8">You don't have any notifications yet.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
