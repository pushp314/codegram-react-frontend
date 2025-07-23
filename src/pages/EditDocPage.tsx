// =============== src/pages/EditDocPage.tsx ===============
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocEditor } from '../components/docs/DocEditor';
import { apiClient } from '../lib/apiClient';
import { Doc } from '../types';
import { Spinner } from '../components/ui/Spinner';

export const EditDocPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<Doc | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDoc = async () => {
            if (!id) return;
            try {
                const { data } = await apiClient.get<Doc>(`/docs/${id}`);
                setInitialData(data);
            } catch (error) {
                console.error("Failed to fetch doc for editing", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoc();
    }, [id]);

    const handleSubmit = async (values: any) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            const { data } = await apiClient.put<Doc>(`/docs/${id}`, values);
            navigate(`/docs/${data.id}`);
        } catch (error) {
            console.error("Failed to update document", error);
            alert('Error updating document. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Spinner />;
    if (!initialData) return <div>Document not found or you don't have permission to edit it.</div>;

    return <DocEditor onSubmit={handleSubmit} docId={id} initialData={initialData} isSubmitting={isSubmitting} />;
};
