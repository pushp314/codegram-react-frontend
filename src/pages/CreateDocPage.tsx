// =============== src/pages/CreateDocPage.tsx ===============
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocForm } from '../components/docs/DocForm';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';

export const CreateDocPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (values: { title: string; description: string; content: string; tags: string; isPublic: boolean }) => {
        setIsSubmitting(true);
        try {
            const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const { data } = await apiClient.post<Doc>('/docs', { ...values, tags: tagsArray });
            navigate(`/docs/${data.id}`);
        } catch (error) {
            console.error("Failed to create document", error);
            alert('Error creating document. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Document</h1>
            <DocForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
};
