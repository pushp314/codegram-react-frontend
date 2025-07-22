
// =============== src/components/ui/UserAvatar.tsx ===============
import type { User as UserTypeAvatar } from '../../types';

interface UserAvatarProps {
  user: Partial<UserTypeAvatar>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 ${className}`}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || user.username || 'User Avatar'}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials(user.name || user.username)}</span>
      )}
    </div>
  );
}
