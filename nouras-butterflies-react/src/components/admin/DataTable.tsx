import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import type { DataTableColumn, DataTableAction } from '../../types/admin';

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  actions?: DataTableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  onRowClick,
  actions,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showActionsForRow, setShowActionsForRow] = useState<string | null>(null);

  const handleSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key as keyof T, direction);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  if (loading) {
    return <DataTableSkeleton columns={columns.length} rows={5} className={className} />;
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl text-gray-400">inbox</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {column.label}
                      {sortConfig?.key === column.key && (
                        <span className="material-symbols-outlined text-sm">
                          {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={() => setShowActionsForRow(String(index))}
                onMouseLeave={() => setShowActionsForRow(null)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row)
                      : row[column.key as keyof T]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div
                      className={cn(
                        'flex items-center justify-end gap-2 transition-opacity',
                        showActionsForRow === String(index) ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className={cn(
                            'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                            action.variant === 'danger' && 'text-red-600 hover:text-red-700'
                          )}
                          title={action.label}
                        >
                          {action.icon ? (
                            <span className="material-symbols-outlined text-sm">{action.icon}</span>
                          ) : (
                            <span className="text-xs">{action.label}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton component for loading state
interface DataTableSkeletonProps {
  columns: number;
  rows: number;
  className?: string;
}

function DataTableSkeleton({ columns, rows, className }: DataTableSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header Skeleton */}
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
