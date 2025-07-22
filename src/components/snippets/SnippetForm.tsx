// =============== src/components/snippets/SnippetForm.tsx ===============
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface SnippetFormProps {
    onSubmit: (values: any) => Promise<void>;
    initialData?: any;
    isSubmitting?: boolean;
}

export const SnippetForm: React.FC<SnippetFormProps> = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [language, setLanguage] = useState(initialData.language || 'javascript');
    const [content, setContent] = useState(initialData.content || '');
    const [tags, setTags] = useState((initialData.tags || []).join(', '));
    const [isPublic, setIsPublic] = useState(initialData.isPublic !== false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, language, content, tags, isPublic });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{initialData.id ? 'Edit Snippet' : 'New Snippet Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Custom Hook for API Calls" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of your code snippet." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" value={language} onChange={e => setLanguage(e.target.value)} placeholder="e.g., javascript" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., react, hooks, api" />
                    </div>
                    <div className="space-y-2">
                        <Label>Code</Label>
                         <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Editor
                                height="400px"
                                language={language.toLowerCase()}
                                value={content}
                                onChange={(value) => setContent(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="isPublic">Make this snippet public</Label>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size={20} /> : (initialData.id ? 'Save Changes' : 'Create Snippet')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};
