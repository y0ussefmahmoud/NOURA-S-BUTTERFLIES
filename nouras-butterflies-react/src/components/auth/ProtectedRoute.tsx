import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Store the intended destination for post-login redirect
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      sessionStorage.setItem('nouras-redirect-path', location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// A wrapper component that shows a loading state while checking authentication
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-6">
            <span className="material-symbols-rounded text-6xl text-gray-400">lock</span>
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access this page.</p>
          <Button
            onClick={() => (window.location.href = '/login')}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );
};
