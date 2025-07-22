// =============== src/App.tsx ===============
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Spinner } from './components/ui/Spinner';
import { AppRouter } from './router';
import { useSocket } from './hooks/useSocket';
import { useNotificationStore } from './store/notificationStore';

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { fetchNotifications } = useNotificationStore();

  // Initialize Socket.IO connection
  useSocket();

  useEffect(() => {
    checkAuth();
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
        setTheme(storedTheme);
    }
  }, [checkAuth, setTheme]);

  useEffect(() => {
    if (user) {
      // Fetch initial notifications when user logs in
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
