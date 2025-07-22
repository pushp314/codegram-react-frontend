// =============== src/components/layout/SettingsLayout.tsx ===============
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Shield, Bell, Palette, UserX } from 'lucide-react';

const settingsNavItems = [
    { icon: User, label: 'Edit Profile', path: '/settings/profile' },
    { icon: Shield, label: 'Privacy', path: '/settings/privacy' },
    { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
    { icon: Palette, label: 'Appearance', path: '/settings/appearance' },
    { icon: UserX, label: 'Blocked Users', path: '/settings/blocked' },
];

export const SettingsLayout: React.FC = () => {
    const activeClass = 'bg-gray-100 dark:bg-gray-700 text-sky-500';
    const inactiveClass = 'hover:bg-gray-100 dark:hover:bg-gray-700';

    return (
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1 mb-8 md:mb-0">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <nav className="space-y-1">
                    {settingsNavItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive ? activeClass : inactiveClass}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="md:col-span-3">
                <Outlet />
            </main>
        </div>
    );
};
