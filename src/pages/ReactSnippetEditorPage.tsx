// =============== src/pages/ReactSnippetEditorPage.tsx ===============
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const ReactSnippetEditorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto text-center">
            <header className="mb-6 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={() => navigate('/create/snippet/select')}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </header>
            <h1 className="text-3xl font-bold">React + Tailwind Snippet Editor</h1>
            <p className="text-gray-500 mt-4">
                This feature is coming soon! Building a secure, live React sandbox is complex.
                For now, you can create HTML + Tailwind snippets.
            </p>
        </div>
    );
};
