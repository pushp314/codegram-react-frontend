
// =============== src/router/ProtectedRoute.tsx ===============
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore as useAuthStoreProtected } from '../store/authStore';

export const ProtectedRoute: React.FC = () => {
    const { user, isLoading } = useAuthStoreProtected();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};
