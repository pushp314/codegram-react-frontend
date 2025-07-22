// =============== src/router/AdminRoute.tsx ===============
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AdminRoute: React.FC = () => {
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};
