import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Use a ref to hold the socket instance to prevent re-renders from recreating it
const socketRef = { current: null as Socket | null };

export const useSocket = () => {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(socketRef.current?.connected || false);

  useEffect(() => {
    // Connect only if we have a user and there's no existing connection
    if (user && !socketRef.current) {
      console.log('Connecting to socket server...');
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
        setIsConnected(true);
        // Join the user-specific room for private notifications
        socketRef.current?.emit('join-user-room', user.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
    }

    // Disconnect if the user logs out
    if (!user && socketRef.current) {
        console.log('Disconnecting socket due to logout...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
    }

    // Cleanup on component unmount (e.g., closing the browser tab)
    return () => {
      // This part is more for safety; the logout logic is primary.
      if (socketRef.current) {
        console.log('Disconnecting socket on component unmount...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user]);

  return { socket: socketRef.current, isConnected };
};
