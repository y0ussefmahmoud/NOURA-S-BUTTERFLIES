import React from 'react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: string;
  subtitle?: string;
  className?: string;
  format?: 'currency' | 'number' | 'percentage';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon,
  subtitle,
  className,
  format = 'currency',
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      switch (format) {
        case 'currency':
          if (val >= 1000000) {
            return `$${(val / 1000000).toFixed(1)}M`;
          } else if (val >= 1000) {
            return `$${(val / 1000).toFixed(1)}K`;
          }
          return `$${val.toLocaleString()}`;
        case 'number':
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M`;
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(1)}K`;
          }
          return val.toLocaleString();
        case 'percentage':
          return `${val}%`;
        default:
          return val.toString();
      }
    }
    return val;
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change}%`;
  };

  return (
    <div
      className={cn(
        'relative bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]',
        'border border-gray-100 dark:border-gray-800',
        className
      )}
    >
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-admin-primary/5 rounded-bl-xl" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-admin-primary/10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-admin-primary text-xl">{icon}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(value)}</p>
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              changeType === 'increase'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            <span className="material-symbols-outlined text-sm">
              {changeType === 'increase' ? 'trending_up' : 'trending_down'}
            </span>
            {formatChange(change)}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};
