// =============== src/components/layout/Navbar.tsx ===============
import { LogOut, Sun, Moon, Search, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Input } from '../ui/Input';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
      setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          navigate(`/search?q=${searchQuery.trim()}`);
      }
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b dark:border-gray-700 gap-4">
      <div className="flex-1 min-w-0">
         <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input name="search" placeholder="Search..." className="pl-10 w-full max-w-md" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
         </form>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
        {user ? (
          <>
            <NotificationDropdown />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button><Plus size={16} className="mr-2" /> New</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => navigate('/create/snippet/select')}>Snippet</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/create/doc')}>Document</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/create/bug')}>Bug Report</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <LogOut />
            </button>
          </>
        ) : (
          <Link to="/login"><Button>Login</Button></Link>
        )}
      </div>
    </header>
  );
}
