// =============== src/components/sidebar/SuggestedUsers.tsx ===============
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { User } from '../../types';
import { UserAvatar } from '../ui/UserAvatar';
import { Button } from '../ui/Button';

export const SuggestedUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const { data } = await apiClient.get('/follows/suggestions', { params: { limit: 5 } });
                setUsers(data.suggestions);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    if (isLoading) {
        return <div className="text-sm text-gray-500">Loading suggestions...</div>;
    }

    if (users.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Who to follow</h3>
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                        <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
                            <UserAvatar user={user} size="sm" />
                            <div>
                                <p className="font-semibold text-sm hover:underline">{user.name || user.username}</p>
                                <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                        </Link>
                        <Button size="sm" variant="outline">Follow</Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
