// =============== src/pages/settings/NotificationSettingsPage.tsx ===============
import React, { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const NotificationSettingsPage: React.FC = () => {
    const { preferences, isLoading, fetchPreferences, updatePreferences } = useSettingsStore();

    useEffect(() => {
        if (!preferences) {
            fetchPreferences();
        }
    }, [preferences, fetchPreferences]);

    if (isLoading || !preferences) return <Spinner />;

    const handleNotificationChange = (key: string, value: any) => {
        updatePreferences({ notifications: { ...preferences.notifications, [key]: value } });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="email-likes">Likes via Email</Label>
                    <Switch
                        id="email-likes"
                        checked={preferences.notifications.likes}
                        onCheckedChange={(checked) => handleNotificationChange('likes', checked)}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="email-comments">Comments via Email</Label>
                    <Switch
                        id="email-comments"
                        checked={preferences.notifications.comments}
                        onCheckedChange={(checked) => handleNotificationChange('comments', checked)}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="email-follows">Follows via Email</Label>
                    <Switch
                        id="email-follows"
                        checked={preferences.notifications.follows}
                        onCheckedChange={(checked) => handleNotificationChange('follows', checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
