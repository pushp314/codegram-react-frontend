import { Home, Code, Search, Bell, Bookmark, Settings, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserAvatar } from '../ui/UserAvatar';

export function Sidebar() {
  const { user } = useAuthStore();

  // In a real router, you would use Link components and check for active routes.
  // For now, we'll use placeholders.
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Code, label: 'Public Feed', path: '/public' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: UserIcon, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex-col border-r dark:border-gray-700 hidden md:flex">
      <h1 className="text-2xl font-bold text-sky-500 mb-8 cursor-pointer">CodeGram</h1>
      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.label} className="mb-2">
              <a
                href="#!" // Placeholder link
                className="flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <item.icon className="mr-3" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {user && (
        <div className="mt-auto">
          <div className="flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <UserAvatar user={user} size="md" />
            <div className="ml-3">
              <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
