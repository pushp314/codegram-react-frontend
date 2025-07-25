import { useState } from 'react';
import { apiClient } from '../lib/apiClient';

export const useFollow = (profileUserId: string, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      await apiClient.post('/follows', { followingId: profileUserId });
      setIsFollowing(!isFollowing);
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false);
  };

  return { isFollowing, handleFollowToggle, loading };
};