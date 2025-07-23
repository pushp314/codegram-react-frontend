// =============== src/pages/SelectSnippetTypePage.tsx ===============
import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Wind } from 'lucide-react'; // Using Wind for Tailwind

export const SelectSnippetTypePage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Create Code Snippet</h1>
            <p className="text-gray-500 mb-8">Choose the type of code snippet you want to create.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <Link to="/create/snippet/html" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-transparent hover:border-sky-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Code className="w-8 h-8 text-orange-500" />
                        <Wind className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-lg font-semibold">HTML + Tailwind CSS</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create beautiful UI components with HTML and Tailwind CSS.</p>
                </Link>
                <Link to="/create/snippet/react" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-transparent hover:border-sky-500">
                     <div className="flex items-center gap-3 mb-4">
                        <img src="/react.svg" alt="React Logo" className="w-8 h-8" />
                        <Wind className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-lg font-semibold">React + Tailwind CSS</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Build interactive React components with Tailwind styling.</p>
                </Link>
            </div>
        </div>
    );
};
