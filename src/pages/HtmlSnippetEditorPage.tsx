// =============== src/pages/HtmlSnippetEditorPage.tsx ===============
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { apiClient } from '../lib/apiClient';
import { Snippet } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { Switch } from '../components/ui/Switch';
import { Spinner } from '../components/ui/Spinner';
import { Save, Send, ArrowLeft, Hash, X, Plus } from 'lucide-react';

export const HtmlSnippetEditorPage: React.FC = () => {
    const navigate = useNavigate();
    const [htmlCode, setHtmlCode] = useState('<div class="p-8 bg-gray-100 dark:bg-gray-900">\n  <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Hello, Tailwind!</h1>\n</div>');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const srcDoc = `
        <html>
          <body>${htmlCode}</body>
          <script src="https://cdn.tailwindcss.com"></script>
        </html>
      `;

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                title,
                description,
                tags,
                isPublic,
                content: htmlCode,
                language: 'html',
                type: 'html-tailwind', // Custom type
            };
            const { data } = await apiClient.post<Snippet>('/snippets', payload);
            navigate(`/snippets/${data.id}`);
        } catch (error) {
            console.error("Failed to create snippet", error);
            alert("Failed to create snippet");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSubmit}>
                <header className="mb-6 flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={() => navigate('/create/snippet/select')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div className="flex items-center space-x-3">
                        <Button type="button" variant="outline"><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size={20} /> : <><Send className="h-4 w-4 mr-2" /> Publish</>}
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
                    <div className="bg-gray-800 rounded-xl flex flex-col">
                        <div className="p-4 text-white font-semibold border-b border-gray-700">Code Editor</div>
                        <Editor
                            height="100%"
                            language="html"
                            theme="vs-dark"
                            value={htmlCode}
                            onChange={(value) => setHtmlCode(value || '')}
                            options={{ minimap: { enabled: false } }}
                        />
                    </div>
                     <div className="bg-white dark:bg-gray-800 rounded-xl flex flex-col">
                        <div className="p-4 font-semibold border-b dark:border-gray-700">Live Preview</div>
                        <iframe
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            width="100%"
                            height="100%"
                            className="border-0"
                        />
                    </div>
                </div>

                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border p-6">
                    <h3 className="text-lg font-semibold mb-4">Snippet Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Title *</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required />
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
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
                            <Label htmlFor="isPublic">Make this snippet public</Label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
