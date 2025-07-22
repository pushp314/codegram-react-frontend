import { User } from '../../types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <img
      src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
      alt={user.name || user.username}
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  );
}
