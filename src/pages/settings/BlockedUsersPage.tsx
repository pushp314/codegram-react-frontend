import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/apiClient';
import { User } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const BlockedUsersPage: React.FC = () => {
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlockedUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            // Updated endpoint to match your backend
            const { data } = await apiClient.get('/moderation/blocked');
            setBlockedUsers(data.blockedUsers);
        } catch (error) {
            console.error("Failed to fetch blocked users", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

    const handleUnblock = async (userId: string) => {
        try {
            // Optimistically remove the user from the list
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            // Use moderation endpoint with userId in body
            await apiClient.post('/moderation/block', { userId });
        } catch (error) {
            console.error("Failed to unblock user", error);
            // Re-fetch to get the correct state if the API call fails
            fetchBlockedUsers();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
                <CardDescription>Users you have blocked will not be able to see your content or interact with you.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Spinner />
                ) : blockedUsers.length > 0 ? (
                    <div className="space-y-4">
                        {blockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between">
                                <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
                                    <UserAvatar user={user} size="md" />
                                    <div>
                                        <p className="font-semibold hover:underline">{user.name || user.username}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => handleUnblock(user.id)}>
                                    Unblock
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">You haven't blocked any users.</p>
                )}
            </CardContent>
        </Card>
    );
};