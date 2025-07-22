// =============== src/components/docs/DocForm.tsx ===============
import React from 'react'
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface DocFormProps {
    onSubmit: (values: any) => Promise<void>;
    initialData?: any;
    isSubmitting?: boolean;
}

export const DocForm: React.FC<DocFormProps> = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [title, setTitle] = React.useState(initialData.title || '');
    const [description, setDescription] = React.useState(initialData.description || '');
    const [content, setContent] = React.useState(initialData.content || '');
    const [tags, setTags] = React.useState((initialData.tags || []).join(', '));
    const [isPublic, setIsPublic] = React.useState(initialData.isPublic !== false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, content, tags, isPublic });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{initialData.id ? 'Edit Document' : 'New Document'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Getting Started with React Hooks" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A short summary of your document." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (Markdown)</Label>
                        <Textarea 
                            id="content" 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            placeholder="Write your documentation here using Markdown..."
                            className="min-h-[400px] font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., react, tutorial, webdev" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4" />
                        <Label htmlFor="isPublic">Make this document public</Label>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size={20} /> : (initialData.id ? 'Save Changes' : 'Publish Document')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};
