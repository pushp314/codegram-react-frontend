// =============== src/hooks/useSocket.ts ===============
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Notification } from '../types';

let socket: Socket;

export const useSocket = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (user && !socket) {
            socket = io(SOCKET_URL, {
                withCredentials: true,
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
            });

            socket.on('new_notification', (notification: Notification) => {
                addNotification(notification);
                // Optional: show a toast notification
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                    socket = null as any;
                }
            };
        }
    }, [user, addNotification]);
};
