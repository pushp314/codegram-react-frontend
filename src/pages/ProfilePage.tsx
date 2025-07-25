import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient as apiProfilePage } from '../lib/apiClient';
import { UserProfile } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { UserContentList } from '../components/profile/UserContentList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { FollowListModal } from '../components/profile/FollowListModal';

// Define a type for the data we expect from the API for the profile page
type ProfilePageData = UserProfile & { 
  isFollowing?: boolean; 
  isBlockedByMe?: boolean; 
};

export function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<ProfilePageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);
    const [isTogglingBlock, setIsTogglingBlock] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');

    // Fetch user profile info
    const fetchUser = useCallback(async (currentUsername: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Correct endpoint per your backend
            const { data } = await apiProfilePage.get<ProfilePageData>(`/users/${currentUsername}`);
            setProfile(data);
        } catch (err) {
            setError('Failed to fetch user profile.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (username) {
            setProfile(null);
            fetchUser(username);
        }
    }, [username, fetchUser]);

    const handleFollowToggle = async () => {
        if (!profile || !profile.user) return;
        setIsTogglingFollow(true);
        const originalProfile = profile;

        // Optimistic update
        setProfile(prev => {
            if (!prev || !prev.user) return null;
            const isFollowing = !prev.isFollowing;
            const followersCount = (prev.user._count?.followers ?? 0) + (isFollowing ? 1 : -1);
            return {
                ...prev,
                isFollowing,
                user: {
                    ...prev.user,
                    _count: { ...(prev.user._count!), followers: followersCount }
                }
            };
        });

        try {
            await apiProfilePage.post(`/users/${profile.user.username}/follow`);
        } catch (error) {
            console.error("Failed to toggle follow", error);
            setProfile(originalProfile);
        } finally {
            setIsTogglingFollow(false);
        }
    };

    // Use moderation endpoint for block/unblock
    const handleBlockToggle = async () => {
        if (!profile || !profile.user) return;
        setIsTogglingBlock(true);
        const originalProfile = profile;
        setProfile(prev => prev ? { ...prev, isBlockedByMe: !prev.isBlockedByMe } : null);

        try {
            await apiProfilePage.post('/moderation/block', { userId: profile.user.id });
        } catch (error) {
            console.error("Failed to toggle block", error);
            setProfile(originalProfile);
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
    if (!profile || !profile.user) return <div className="text-center">User not found.</div>;
    if (profile.isBlockedByMe) return <div className="text-center text-gray-500">You have blocked this user. You need to unblock them from settings to see their profile.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <ProfileHeader 
                user={profile.user} 
                isFollowing={profile.isFollowing}
                isBlockedByMe={profile.isBlockedByMe}
                onFollowToggle={handleFollowToggle} 
                isTogglingFollow={isTogglingFollow}
                onBlockToggle={handleBlockToggle}
                isTogglingBlock={isTogglingBlock}
                onFollowersClick={openFollowersModal}
                onFollowingClick={openFollowingModal}
            />
            
            <Tabs defaultValue="snippets" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="snippets">Snippets ({profile.user._count?.snippets ?? 0})</TabsTrigger>
                    <TabsTrigger value="docs">Docs ({profile.user._count?.docs ?? 0})</TabsTrigger>
                    <TabsTrigger value="bugs">Bugs ({profile.user._count?.bugs ?? 0})</TabsTrigger>
                </TabsList>
                <TabsContent value="snippets">
                    {/* Correct fetch: uses /users/:username/content?type=snippets */}
                    <UserContentList username={profile.user.username} type="snippets" />
                </TabsContent>
                <TabsContent value="docs">
                    {/* Correct fetch: uses /users/:username/content?type=docs */}
                    <UserContentList username={profile.user.username} type="docs" />
                </TabsContent>
            </Tabs>

            {isFollowModalOpen && (
                <FollowListModal
                    userId={profile.user.id}
                    username={profile.user.username}
                    initialTab={followModalType}
                    isOpen={isFollowModalOpen}
                    onClose={() => setIsFollowModalOpen(false)}
                />
            )}
        </div>
    );
}