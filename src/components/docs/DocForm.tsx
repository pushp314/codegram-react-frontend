// =============== src/components/docs/DocForm.tsx ===============
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { useAutosave, loadDraft } from '../../hooks/useAutosave';
import { useUpload } from '../../hooks/useUpload';

interface DocFormProps {
    onSubmit: (values: any) => Promise<void>;
    docId?: string; // For editing existing docs
    initialData?: any;
    isSubmitting?: boolean;
}

export const DocForm: React.FC<DocFormProps> = ({ onSubmit, docId, initialData = {}, isSubmitting }) => {
    const formKey = `doc-draft-${docId || 'new'}`;
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [content, setContent] = useState(initialData.content || '');
    const [tags, setTags] = useState((initialData.tags || []).join(', '));
    const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
    
    const { uploadFile, isUploading } = useUpload('media');
    const { clearSavedDraft } = useAutosave(formKey, { title, description, content, tags, coverImage });

    useEffect(() => {
        const draft = loadDraft<{ title: string; description: string; content: string; tags: string, coverImage: string }>(formKey);
        if (draft) {
            setTitle(draft.title);
            setDescription(draft.description);
            setContent(draft.content);
            setTags(draft.tags);
            setCoverImage(draft.coverImage);
        }
    }, [formKey]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result) {
                setCoverImage(result.url);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ title, description, content, tags, coverImage });
        clearSavedDraft();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{docId ? 'Edit Document' : 'New Document'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Cover Image</Label>
                            <Input id="coverImage" type="file" onChange={handleFileChange} accept="image/*" />
                            {isUploading && <Spinner size={20} />}
                            {coverImage && <img src={coverImage} alt="Cover preview" className="mt-2 rounded-md max-h-40" />}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (Markdown)</Label>
                        <Textarea 
                            id="content" 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            className="min-h-[500px] font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                         <Label>Preview</Label>
                         <div 
                            className="p-4 border rounded-md min-h-[500px] bg-white dark:bg-gray-800 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: marked(content) }}
                         />
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting || isUploading}>
                                {isSubmitting ? <Spinner size={20} /> : (docId ? 'Save Changes' : 'Publish Document')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
};
