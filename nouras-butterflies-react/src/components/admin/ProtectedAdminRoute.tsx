import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredResource?: string;
  fallback?: 'login' | '403';
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredPermission,
  requiredResource,
  fallback = 'login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin, hasPermission, canAccess } = useAdmin();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (!isAdmin) {
    if (fallback === '403') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl text-red-600">lock</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin panel.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl text-yellow-600">security</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h1>
          <p className="text-gray-600 mb-6">
            You don't have the required permissions to access this resource.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check resource access if required
  if (requiredResource && !canAccess(requiredResource)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl text-orange-600">block</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resource Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this resource.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
