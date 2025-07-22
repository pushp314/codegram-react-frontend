// =============== src/pages/settings/PrivacySettingsPage.tsx ===============
import React, { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export const PrivacySettingsPage: React.FC = () => {
    const { preferences, isLoading, fetchPreferences, updatePreferences } = useSettingsStore();

    useEffect(() => {
        if (!preferences) {
            fetchPreferences();
        }
    }, [preferences, fetchPreferences]);

    if (isLoading || !preferences) return <Spinner />;

    const handlePrivacyChange = (key: string, value: any) => {
        updatePreferences({ privacy: { ...preferences.privacy, [key]: value } });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your profile visibility and data settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="profileVisibility" className="font-semibold">Private Profile</Label>
                        <p className="text-sm text-gray-500">When your profile is private, only people you approve can see your content.</p>
                    </div>
                    <Switch
                        id="profileVisibility"
                        checked={preferences.privacy.profileVisibility === 'private'}
                        onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked ? 'private' : 'public')}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="showLocation" className="font-semibold">Show Location</Label>
                        <p className="text-sm text-gray-500">Allow others to see your location on your profile.</p>
                    </div>
                    <Switch
                        id="showLocation"
                        checked={preferences.privacy.showLocation}
                        onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
