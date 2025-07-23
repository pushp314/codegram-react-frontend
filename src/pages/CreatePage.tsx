// =============== src/pages/CreatePage.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { Code, FileText, Bug } from 'lucide-react';

const creationOptions = [
    { 
        icon: Code, 
        title: 'Code Snippet', 
        description: 'Share a piece of reusable code with the community.', 
        path: '/create/snippet/select' 
    },
    { 
        icon: FileText, 
        title: 'Documentation', 
        description: 'Write a long-form tutorial or guide in Markdown.', 
        path: '/create/doc' 
    },
    { 
        icon: Bug, 
        title: 'Bug Report', 
        description: 'Post a 24-hour ephemeral report about a bug you\'ve found.', 
        path: '/create/bug' 
    },
];

export const CreatePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create New Content</h1>
            <p className="text-gray-500 mb-8">What would you like to create today?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creationOptions.map(option => (
                    <Link 
                        to={option.path} 
                        key={option.title}
                        className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-transparent hover:border-sky-500"
                    >
                        <option.icon className="w-10 h-10 text-sky-500 mb-4" />
                        <h2 className="text-lg font-semibold">{option.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
