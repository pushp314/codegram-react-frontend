// =============== src/components/docs/DocEditor.tsx ===============
import React, { useState, useEffect } from 'react';
import { Save, Send, Eye, FileText, X, Hash, Plus, UploadCloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAutosave, loadDraft } from '../../hooks/useAutosave';
import { useUpload } from '../../hooks/useUpload';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Spinner } from '../ui/Spinner';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';

interface DocEditorProps {
  onSubmit: (values: any) => Promise<void>;
  docId?: string;
  initialData?: any;
  isSubmitting?: boolean;
}

export const DocEditor: React.FC<DocEditorProps> = ({ onSubmit, docId, initialData = {}, isSubmitting }) => {
    const formKey = `doc-draft-${docId || 'new'}`;

    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [markdown, setMarkdown] = useState(initialData.content || '');
    const [tags, setTags] = useState<string[]>(initialData.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [isPublic, setIsPublic] = useState(initialData.isPublic !== false);
    const [coverImage, setCoverImage] = useState(initialData.coverImage || '');

    const { uploadFile, isUploading } = useUpload('media');
    const { clearSavedDraft } = useAutosave(formKey, { title, description, markdown, tags, isPublic, coverImage });

    useEffect(() => {
        const draft = loadDraft<any>(formKey);
        if (draft) {
            setTitle(draft.title || '');
            setDescription(draft.description || '');
            setMarkdown(draft.markdown || '');
            // Ensure tags are always an array
            setTags(Array.isArray(draft.tags) ? draft.tags : []);
            setIsPublic(draft.isPublic !== false);
            setCoverImage(draft.coverImage || '');
        }
    }, [formKey]);

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result) setCoverImage(result.url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ title, description, content: markdown, tags, isPublic, coverImage });
        clearSavedDraft();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSubmit}>
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{docId ? 'Edit Document' : 'Create Document'}</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button type="button" variant="outline" disabled={isSubmitting}>
                            <Save className="h-4 w-4 mr-2" /> Save Draft
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isSubmitting ? <Spinner size={20} /> : <><Send className="h-4 w-4 mr-2" /> {docId ? 'Update' : 'Publish'}</>}
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border flex flex-col">
                        <div className="p-4 border-b flex items-center gap-2"><FileText size={20} /> Markdown</div>
                        <Textarea value={markdown} onChange={e => setMarkdown(e.target.value)} className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none border-0" placeholder="Write your documentation..." />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border flex flex-col">
                        <div className="p-4 border-b flex items-center gap-2"><Eye size={20} /> Preview</div>
                        <div className="flex-1 overflow-y-auto p-6 prose prose-lg dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border p-6">
                    <h3 className="text-lg font-semibold mb-4">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Title *</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div>
                            <Label>Tags</Label>
                            <div className="flex items-center gap-2">
                                <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}} placeholder="Add a tag..." />
                                <Button type="button" onClick={handleAddTag}><Plus size={16} /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
                                        <Hash size={12} className="mr-1" /> {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label>Cover Image</Label>
                            <div className="flex items-center gap-2">
                                <Input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Image URL or upload" />
                                <Button asChild variant="outline">
                                    <label htmlFor="cover-upload" className="cursor-pointer"><UploadCloud size={16} /></label>
                                </Button>
                                <input id="cover-upload" type="file" className="hidden" onChange={handleCoverImageUpload} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                            <Label htmlFor="isPublic">Make Public</Label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
