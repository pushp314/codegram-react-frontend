// =============== src/pages/CreateSnippetPage.tsx ===============
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SnippetForm } from '../components/snippets/SnippetForm';
import { apiClient } from '../lib/apiClient';
import { Snippet } from '../types';

export const CreateSnippetPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { title: string; description: string; language: string; content: string; tags: string; isPublic: boolean }) => {
        try {
            const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const { data } = await apiClient.post<Snippet>('/snippets', { ...values, tags: tagsArray });
            navigate(`/snippets/${data.id}`);
        } catch (error) {
            console.error("Failed to create snippet", error);
            // Here you would typically show an error message to the user
            alert('Error creating snippet. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Snippet</h1>
            <SnippetForm onSubmit={handleSubmit} />
        </div>
    );
};
