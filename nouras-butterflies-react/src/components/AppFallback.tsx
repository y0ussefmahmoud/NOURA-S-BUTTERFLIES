import React from 'react';

interface AppFallbackProps {
  error?: string;
}

/**
 * AppFallback component for critical application initialization errors
 * Displays a user-friendly error screen with reload functionality
 */
export const AppFallback: React.FC<AppFallbackProps> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
    <div className="max-w-md w-full text-center">
      <div className="text-6xl mb-4">🦋</div>
      <h1 className="text-2xl font-bold mb-4">Unable to Load Application</h1>
      <p className="text-gray-600 mb-6">
        {error || 'The app failed to initialize. This might be due to a configuration issue.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export default AppFallback;
