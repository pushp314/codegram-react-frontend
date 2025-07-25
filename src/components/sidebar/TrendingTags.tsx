import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { Tag } from 'lucide-react';

interface TrendingTag {
    tag: string;
    count: number;
}

export const TrendingTags: React.FC = () => {
    const [tags, setTags] = useState<TrendingTag[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchTags = async () => {
            try {
                const { data } = await apiClient.get('/search/tags', { params: { limit: 7 } });
                // Support both { tags: [...] } and just an array
                let tagList: TrendingTag[] = [];
                if (Array.isArray(data)) {
                    tagList = data;
                } else if (data && Array.isArray(data.tags)) {
                    tagList = data.tags;
                }
                if (!cancelled) setTags(tagList);
            } catch (error) {
                setError('Failed to fetch trending tags');
                // Optionally log error for debugging
                console.error("Failed to fetch trending tags", error);
            }
        };
        fetchTags();
        return () => { cancelled = true; };
    }, []);

    if (error) {
        return (
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Trending Tags</h3>
                <div className="text-xs text-red-500">{error}</div>
            </div>
        );
    }

    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(({ tag }) => (
                    <Link 
                        key={tag} 
                        to={`/search?q=${encodeURIComponent(tag)}&type=snippets`}
                        className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                       <Tag size={12} className="mr-1" /> {tag}
                    </Link>
                ))}
            </div>
        </div>
    );
};