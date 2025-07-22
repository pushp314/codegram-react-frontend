// =============== src/components/layout/AppLayout.tsx ===============
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useKeyPress } from '../../hooks/useKeyPress';

export function AppLayout() {
  const navigate = useNavigate();

  // Add a keyboard shortcut (Cmd+K or Ctrl+K) to navigate to the search page
  useKeyPress('k', () => {
    navigate('/search');
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
