import React from 'react';
import { cn } from '../../utils/cn';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  className?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  className,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-md w-full p-6',
            className
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
              variant === 'danger' ? 'bg-red-100' : 'bg-admin-primary/10'
            )}
          >
            <span
              className={cn(
                'material-symbols-outlined text-xl',
                variant === 'danger' ? 'text-red-600' : 'text-admin-primary'
              )}
            >
              {variant === 'danger' ? 'warning' : 'help'}
            </span>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg transition-colors duration-200',
                variant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-admin-primary text-white hover:bg-admin-primary/90'
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
