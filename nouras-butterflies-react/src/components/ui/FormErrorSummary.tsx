import React from 'react';
import { cn } from '../../utils/cn';

interface FormErrorSummaryProps {
  errors: Record<string, string | undefined | null>;
  title?: string;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  title = 'Please fix the following issues:',
  className,
}) => {
  const entries = Object.entries(errors).filter(([, value]) => value);

  if (entries.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700',
        'dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-semibold mb-2">{title}</p>
      <ul className="list-disc list-inside space-y-1">
        {entries.map(([field, message]) => (
          <li key={field}>
            <a href={`#${field}`} className="underline">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
