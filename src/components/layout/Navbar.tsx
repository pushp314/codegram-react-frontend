// =============== src/components/layout/Navbar.tsx ===============
import { PlusCircle, LogOut, Sun, Moon, Github as GithubNav } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { API_BASE_URL } from '../../config/constants';
import { Link } from 'react-router-dom';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b dark:border-gray-700 flex-shrink-0">
      <div>{/* Placeholder for breadcrumbs or page title */}</div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
        {user ? (
          <>
            <NotificationDropdown />
            <Link to="/create/snippet" className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
              <PlusCircle size={20} /> New
            </Link>
            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <LogOut />
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <GithubNav size={20} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
