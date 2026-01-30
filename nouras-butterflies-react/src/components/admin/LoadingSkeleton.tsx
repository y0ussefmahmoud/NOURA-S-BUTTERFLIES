import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
