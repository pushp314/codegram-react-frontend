// =============== src/components/profile/FollowListModal.tsx ===============
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { User } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../ui/UserAvatar';
import { Button } from '../ui/Button';

interface FollowListModalProps {
  userId: string;
  username: string;
  initialTab: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
}

const UserList: React.FC<{ userId: string; type: 'followers' | 'following'; onClose: () => void }> = ({ userId, type, onClose }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const { data } = await apiClient.get(`/follows/${userId}/${type}`);
                setUsers(data[type]);
            } catch (error) {
                console.error(`Failed to fetch ${type}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [userId, type]);

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {users.length > 0 ? users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                    <Link to={`/profile/${user.username}`} onClick={onClose} className="flex items-center gap-3">
                        <UserAvatar user={user} size="md" />
                        <div>
                            <p className="font-semibold hover:underline">{user.name || user.username}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                    </Link>
                    {/* In a real app, you'd check if the current user is following this user */}
                    <Button size="sm" variant="outline">Follow</Button>
                </div>
            )) : <p className="text-center text-gray-500">No users to display.</p>}
        </div>
    );
};

export const FollowListModal: React.FC<FollowListModalProps> = ({ userId, username, initialTab, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>@{username}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={initialTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="mt-4">
            <UserList userId={userId} type="followers" onClose={onClose} />
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            <UserList userId={userId} type="following" onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
