import { useEffect, useState } from 'react';
import { Spinner } from '../ui/Spinner';
import { apiClient } from '../../lib/apiClient';
import { SnippetCard } from './SnippetCard';

type Props = {
  username: string;
  type: 'snippets' | 'docs' | 'bugs';
};

export function UserContentList({ username, type }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    apiClient
      .get(`/users/${username}/content?type=${type}&limit=30`)
      .then(res => {
        if (isMounted) setItems(res.data.content || []);
      })
      .catch(() => {
        if (isMounted) setError('Failed to fetch items');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [username, type]);

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!items.length) return <div className="text-gray-500 text-center py-8">No {type} found.</div>;

  return (
    <div className="flex flex-col gap-8 py-6">
      {items.map(item => (
        <SnippetCard key={item.id} snippet={item} />
      ))}
    </div>
  );
}