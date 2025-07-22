// =============== src/components/bugs/BugForm.tsx ===============
import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface BugFormProps {
    onSubmit: (values: any) => Promise<void>;
    initialData?: any;
    isSubmitting?: boolean;
}

export const BugForm: React.FC<BugFormProps> = ({ onSubmit, initialData = {}, isSubmitting }) => {
    const [title, setTitle] = React.useState(initialData.title || '');
    const [description, setDescription] = React.useState(initialData.description || '');
    const [content, setContent] = React.useState(initialData.content || '');
    const [severity, setSeverity] = React.useState(initialData.severity || 'MEDIUM');
    const [tags, setTags] = React.useState((initialData.tags || []).join(', '));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, content, severity, tags });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{initialData.id ? 'Edit Bug Report' : 'New Bug Report'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., CSS Grid not working in Safari" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A short summary of the bug." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Details (Markdown)</Label>
                        <Textarea 
                            id="content" 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            placeholder="Provide steps to reproduce, expected vs. actual behavior, etc."
                            className="min-h-[300px] font-mono"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity</Label>
                            <select 
                                id="severity" 
                                value={severity} 
                                onChange={e => setSeverity(e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., css, safari, layout" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size={20} /> : (initialData.id ? 'Save Changes' : 'Post Bug Report')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};
