// =============== src/pages/CreateBugPage.tsx ===============
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BugForm } from '../components/bugs/BugForm';
import { apiClient } from '../lib/apiClient';
import { Bug } from '../types';

export const CreateBugPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (values: { title: string; description: string; content: string; severity: string; tags: string; }) => {
        setIsSubmitting(true);
        try {
            const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const { data } = await apiClient.post<Bug>('/bugs', { ...values, tags: tagsArray });
            navigate(`/bugs/${data.id}`);
        } catch (error) {
            console.error("Failed to create bug report", error);
            alert('Error creating bug report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Bug Report</h1>
            <p className="text-sm text-gray-500 mb-4">Bug reports are ephemeral and will disappear after 24 hours.</p>
            <BugForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};
