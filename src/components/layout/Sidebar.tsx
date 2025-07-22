// =============== src/components/layout/Sidebar.tsx ===============
import { Home, Code, Search, Bell as BellSidebar, Bookmark, Settings as SettingsSidebar, User as UserIconSidebar, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserAvatar } from '../ui/UserAvatar';
import { NavLink } from 'react-router-dom';
import { SuggestedUsers } from '../sidebar/SuggestedUsers';
import { TrendingTags } from '../sidebar/TrendingTags';

export function Sidebar() {
  const { user } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Code, label: 'Public Feed', path: '/public' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: BellSidebar, label: 'Notifications', path: '/notifications' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: UserIconSidebar, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: SettingsSidebar, label: 'Settings', path: '/settings' },
  ];

  const activeLinkClass = "bg-gray-100 dark:bg-gray-700 text-sky-500";
  const inactiveLinkClass = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex-col border-r dark:border-gray-700 hidden md:flex">
      <NavLink to="/" className="text-2xl font-bold text-sky-500 mb-8 cursor-pointer">CodeGram</NavLink>
      <nav className="flex-grow">
        <ul>
          {user && navItems.map(item => (
            <li key={item.label} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <item.icon className="mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {user && <SuggestedUsers />}
        {user && <TrendingTags />}
      </nav>
      {user && (
        <div className="mt-auto">
          <NavLink to={`/profile/${user.username}`} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <UserAvatar user={user} size="md" />
            <div className="ml-3">
              <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </NavLink>
        </div>
      )}
    </aside>
  );
}
