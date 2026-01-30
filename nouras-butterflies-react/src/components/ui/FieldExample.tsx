import React from 'react';
import { cn } from '../../utils/cn';

interface FieldExampleProps {
  title?: string;
  examples: string[];
  isVisible?: boolean;
  className?: string;
}

export const FieldExample: React.FC<FieldExampleProps> = ({
  title = 'Examples',
  examples,
  isVisible = false,
  className,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'mt-2 rounded-xl border border-accent-pink/30 bg-accent-pink/10 px-4 py-3 text-xs text-text-dark',
        'dark:border-accent-pink/20 dark:text-text-light',
        className
      )}
    >
      <p className="font-semibold text-xs mb-1">{title}</p>
      <ul className="space-y-1">
        {examples.map((example) => (
          <li key={example} className="text-text-muted">
            {example}
          </li>
        ))}
      </ul>
    </div>
  );
};
