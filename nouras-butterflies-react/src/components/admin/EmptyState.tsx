import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon = 'inbox',
  className,
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-2xl text-gray-400">{icon}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
