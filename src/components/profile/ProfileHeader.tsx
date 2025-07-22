// =============== src/components/profile/ProfileHeader.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { UserAvatar } from '../ui/UserAvatar';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { MapPin, Link as LinkIcon, Github, UserPlus, UserCheck, UserX } from 'lucide-react';

interface ProfileHeaderProps {
  user: User & { isFollowing?: boolean; isBlockedByMe?: boolean };
  onFollowToggle: () => void;
  isTogglingFollow: boolean;
  onBlockToggle: () => void;
  isTogglingBlock: boolean;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onFollowToggle, isTogglingFollow, onBlockToggle, isTogglingBlock, onFollowersClick, onFollowingClick }) => {
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <UserAvatar user={user} size="lg" className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <Link to="/settings/profile">
                    <Button variant="outline" size="sm">Edit Profile</Button>
                  </Link>
                ) : (
                  <>
                    <Button size="sm" onClick={onFollowToggle} disabled={isTogglingFollow}>
                      {user.isFollowing ? <UserCheck size={16} className="mr-2" /> : <UserPlus size={16} className="mr-2" />}
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onBlockToggle} disabled={isTogglingBlock}>
                       <UserX size={16} className="mr-2" />
                       {user.isBlockedByMe ? 'Unblock' : 'Block'}
                    </Button>
                  </>
                )}
            </div>
          </div>
          <p className="mt-2">{user.bio}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            {user.location && <div className="flex items-center gap-1"><MapPin size={16} /> {user.location}</div>}
            {user.website && <div className="flex items-center gap-1"><LinkIcon size={16} /> <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">{user.website}</a></div>}
            {user.githubUrl && <div className="flex items-center gap-1"><Github size={16} /> <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">{user.username}</a></div>}
          </div>
        </div>
      </div>
      <div className="flex justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="font-bold text-xl">{user._count?.snippets || 0}</p>
          <p className="text-sm text-gray-500">Snippets</p>
        </div>
        <button onClick={onFollowersClick} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">
          <p className="font-bold text-xl">{user._count?.followers || 0}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </button>
        <button onClick={onFollowingClick} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">
          <p className="font-bold text-xl">{user._count?.following || 0}</p>
          <p className="text-sm text-gray-500">Following</p>
        </button>
      </div>
    </div>
  );
};
