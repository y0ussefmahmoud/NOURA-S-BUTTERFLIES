import React from 'react';
import { VisuallyHidden } from './VisuallyHidden';

interface PageLoaderProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading page content',
  fullscreen = true,
  className = '',
}) => {
  return (
    <div
      className={`${fullscreen ? 'min-h-screen' : 'min-h-32'} flex items-center justify-center bg-background-light dark:bg-background-dark ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <div className="text-center">
        <div
          className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
          aria-hidden="true"
        />
        <p className="mt-4 text-soft-text dark:text-text-light">
          <VisuallyHidden>{message}</VisuallyHidden>
          <span aria-hidden="true">Loading...</span>
        </p>
      </div>
    </div>
  );
};
