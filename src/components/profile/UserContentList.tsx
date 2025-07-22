// =============== src/components/profile/UserContentList.tsx ===============
import React, { useState, useEffect } from 'react';
import { apiClient as apiContent } from '../../lib/apiClient';
import { FeedItemDTO } from '../../types';
import { Spinner } from '../ui/Spinner';
import { FeedItemCard } from '../feed/FeedItemCard';

interface UserContentListProps {
  username: string;
  contentType: 'snippets' | 'docs' | 'bugs';
}

export const UserContentList: React.FC<UserContentListProps> = ({ username, contentType }) => {
  const [content, setContent] = useState<FeedItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await apiContent.get(`/users/${username}/content`, {
          params: { type: contentType },
        });
        setContent(data.content);
      } catch (err) {
        setError(`Failed to fetch ${contentType}.`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [username, contentType]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      {content.length > 0 ? (
        <div className="space-y-6">
          {content.map((item) => (
            <FeedItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No {contentType} found.</p>
        </div>
      )}
    </div>
  );
};
