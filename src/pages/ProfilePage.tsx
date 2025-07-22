// =============== src/pages/ProfilePage.tsx ===============
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient as apiProfilePage } from '../lib/apiClient';
import { User } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { UserContentList } from '../components/profile/UserContentList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { FollowListModal } from '../components/profile/FollowListModal';

type UserProfile = User & { isFollowing?: boolean; isBlockedByMe?: boolean };

export function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [isTogglingBlock, setIsTogglingBlock] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');

    const fetchUser = useCallback(async () => {
        if (!username) return;
        try {
            if (!user) setIsLoading(true);
            const { data } = await apiProfilePage.get<UserProfile>(`/users/${username}`);
            setUser(data);
        } catch (err) {
            setError('Failed to fetch user profile.');
        } finally {
            setIsLoading(false);
        }
    }, [username, user]);

    useEffect(() => {
        fetchUser();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!user) return;
        setIsTogglingFollow(true);
        try {
            const { data } = await apiProfilePage.post(`/follows/${user.id}`);
            setUser(prev => prev ? { ...prev, isFollowing: data.following } : null);
            fetchUser();
        } catch (error) {
            console.error("Failed to toggle follow", error);
        } finally {
            setIsTogglingFollow(false);
        }
    };

    const handleBlockToggle = async () => {
        if (!user) return;
        setIsTogglingBlock(true);
        try {
            const { data } = await apiProfilePage.post(`/users/${user.id}/block`);
            setUser(prev => prev ? { ...prev, isBlockedByMe: data.blocked } : null);
        } catch (error) {
            console.error("Failed to toggle block", error);
        } finally {
            setIsTogglingBlock(false);
        }
    };
    
    const openFollowersModal = () => {
        setFollowModalType('followers');
        setIsFollowModalOpen(true);
    };

    const openFollowingModal = () => {
        setFollowModalType('following');
        setIsFollowModalOpen(true);
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!user) return <div className="text-center">User not found.</div>;
    if (user.isBlockedByMe) return <div className="text-center text-gray-500">You have blocked this user.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <ProfileHeader 
                user={user} 
                onFollowToggle={handleFollowToggle} 
                isTogglingFollow={isTogglingFollow}
                onBlockToggle={handleBlockToggle}
                isTogglingBlock={isTogglingBlock}
                onFollowersClick={openFollowersModal}
                onFollowingClick={openFollowingModal}
            />
            
            <Tabs defaultValue="snippets" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="snippets">Snippets</TabsTrigger>
                    <TabsTrigger value="docs">Docs</TabsTrigger>
                    <TabsTrigger value="bugs">Bugs</TabsTrigger>
                </TabsList>
                <TabsContent value="snippets">
                    <UserContentList username={username!} contentType="snippets" />
                </TabsContent>
                <TabsContent value="docs">
                    <UserContentList username={username!} contentType="docs" />
                </TabsContent>
                <TabsContent value="bugs">
                    <UserContentList username={username!} contentType="bugs" />
                </TabsContent>
            </Tabs>

            {isFollowModalOpen && (
                <FollowListModal
                    userId={user.id}
                    username={user.username}
                    initialTab={followModalType}
                    isOpen={isFollowModalOpen}
                    onClose={() => setIsFollowModalOpen(false)}
                />
            )}
        </div>
    );
}
