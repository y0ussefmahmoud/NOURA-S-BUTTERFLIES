import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setRedirectPath, getRedirectPath, clearRedirectPath } from '../utils/auth';

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        setRedirectPath(currentPath);
      }

      // Redirect to login
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Check for stored redirect path after successful login
    if (isAuthenticated && !isLoading) {
      const redirectPath = getRedirectPath();
      if (redirectPath) {
        clearRedirectPath();
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated && !isLoading,
  };
};
