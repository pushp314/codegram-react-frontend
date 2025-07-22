// =============== src/pages/settings/AppearanceSettingsPage.tsx ===============
import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const AppearanceSettingsPage: React.FC = () => {
    const { theme, setTheme } = useThemeStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="mb-4 font-semibold">Theme</h3>
                <div className="flex gap-4">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                </div>
            </CardContent>
        </Card>
    );
};
