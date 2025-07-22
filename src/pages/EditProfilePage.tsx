// =============== src/pages/EditProfilePage.tsx ===============
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/apiClient';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Spinner } from '../components/ui/Spinner';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useUpload } from '../hooks/useUpload';

export const EditProfilePage: React.FC = () => {
    const { user, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        website: '',
        techStack: '',
        avatar: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { uploadFile, isUploading } = useUpload('profile');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                techStack: (user.techStack || []).join(', '),
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result) {
                setFormData(prev => ({ ...prev, avatar: result.url }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
            };
            await apiClient.put('/users/profile', payload);
            await checkAuth(); // Re-fetch user data to update the store
            navigate(`/profile/${user?.username}`);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return <Spinner />;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center gap-6">
                    <UserAvatar user={{ avatar: formData.avatar }} size="lg" />
                    <div>
                        <Label htmlFor="avatar-upload" className="cursor-pointer text-sky-500 hover:underline">
                            Change Avatar
                        </Label>
                        <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" type="url" value={formData.website} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                    <Input id="techStack" name="techStack" value={formData.techStack} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || isUploading}>
                        {isSubmitting ? <Spinner size={20} /> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
