// =============== src/components/sidebar/TrendingTags.tsx ===============
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

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const { data } = await apiClient.get('/search/tags', { params: { limit: 7 } });
                setTags(data.tags);
            } catch (error) {
                console.error("Failed to fetch trending tags", error);
            }
        };
        fetchTags();
    }, []);

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
                        to={`/search?q=${tag}&type=snippets`}
                        className="flex items-center bg-gray-100 dark:bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                       <Tag size={12} className="mr-1" /> {tag}
                    </Link>
                ))}
            </div>
        </div>
    );
};
