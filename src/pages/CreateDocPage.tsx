// =============== src/pages/CreateDocPage.tsx ===============
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocEditor } from '../components/docs/DocEditor';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';

// Define a clear type for the form values
interface DocFormValues {
    title: string;
    description: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    coverImage: string;
}

export const CreateDocPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (values: DocFormValues) => {
        setIsSubmitting(true);
        try {
            // 1. Add frontend validation to match the backend's requirements
            if (!values.title || !values.content) {
                alert('Title and Content are required fields.');
                setIsSubmitting(false);
                return;
            }

            // 2. Construct a clean, type-safe payload to send to the API
            const payload = {
                title: values.title,
                content: values.content,
                description: values.description || null,
                coverImage: values.coverImage || null,
                tags: Array.isArray(values.tags) ? values.tags : [],
                isPublic: typeof values.isPublic === 'boolean' ? values.isPublic : true,
            };

            const { data } = await apiClient.post<Doc>('/docs', payload);
            navigate(`/docs/${data.id}`);
        } catch (error: any) {
            // 3. Improve error logging for better debugging
            console.error("Failed to create document (full error object):", error);
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please check the console and try again.';
            alert(`Error creating document: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return <DocEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
