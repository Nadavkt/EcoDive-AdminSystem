import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Check if user has access - handle both 'Admin' and 'admin' cases
    const hasAccess = user && allowedRoles.some(role => 
        role.toLowerCase() === user.role?.toLowerCase()
    );

    if (!user || !hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
} 