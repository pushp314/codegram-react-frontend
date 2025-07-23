// =============== src/pages/CreateDocPage.tsx ===============
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocEditor } from '../components/docs/DocEditor';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';

export const CreateDocPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            const { data } = await apiClient.post<Doc>('/docs', values);
            navigate(`/docs/${data.id}`);
        } catch (error) {
            console.error("Failed to create document", error);
            alert('Error creating document. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return <DocEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
