import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useLanguage } from '../../hooks/useLanguage';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { isRTL } = useLanguage();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 mb-8 ${className}`}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <Icon
                  name={isRTL ? 'chevron_left' : 'chevron_right'}
                  className="w-4 h-4 text-foreground-light/40 dark:text-foreground-dark/40"
                />
              )}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-xs uppercase tracking-[0.2em] opacity-60 hover:text-primary transition-colors text-foreground-light dark:text-foreground-dark"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-xs uppercase tracking-[0.2em] ${
                    isLast
                      ? 'text-foreground-light dark:text-foreground-dark font-bold'
                      : 'opacity-60 text-foreground-light dark:text-foreground-dark'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
