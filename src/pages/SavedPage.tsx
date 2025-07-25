import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';

interface Author {
  id: string;
  username: string;
  name?: string;
  avatar?: string;
}

interface Snippet {
  id: string;
  title: string;
  content: string;
  author: Author;
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
}

interface Bookmark {
  id: string;
  snippet: Snippet;
  createdAt: string;
}

export const SavedPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with current user's ID (from context, redux, etc.)
  const userId = 'YOUR_USER_ID';

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/bookmarks/user/${userId}`, {
          params: { type: 'snippets', page: 1, limit: 20 }
        });
        setBookmarks(data.bookmarks);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Snippets</h1>
      {loading ? <div>Loading...</div> : (
        bookmarks.length === 0 ? (
          <div>No saved snippets yet.</div>
        ) : (
          <ul>
            {bookmarks.map(bm => (
              <li key={bm.id} className="mb-4 p-4 border rounded">
                <h2 className="font-semibold">{bm.snippet.title}</h2>
                <pre className="bg-gray-100 mt-2 p-2 rounded">{bm.snippet.content}</pre>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <img
                    src={bm.snippet.author.avatar || '/default-avatar.png'}
                    alt={bm.snippet.author.username}
                    className="w-6 h-6 rounded-full border"
                  />
                  <span>{bm.snippet.author.name || bm.snippet.author.username}</span>
                  <span>· {bm.snippet._count.bookmarks} bookmarks</span>
                  <span>· {bm.snippet._count.likes} likes</span>
                  <span>· {bm.snippet._count.comments} comments</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Saved at {new Date(bm.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};