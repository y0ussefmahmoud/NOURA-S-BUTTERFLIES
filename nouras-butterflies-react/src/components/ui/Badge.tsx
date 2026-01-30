import React from 'react';
import type { BadgeProps } from '../../types/components';
import { cn } from '../../utils/cn';

/**
 * Badge component for labels and tags
 *
 * @param variant - Visual style of the badge
 * @param size - Size of the badge
 * @param rounded - Whether badge should have pill shape
 * @param icon - Icon to display in the badge
 * @param dismissible - Whether badge can be dismissed
 * @param onDismiss - Callback when badge is dismissed
 */
const BadgeComponent = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      rounded = true,
      icon,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center gap-1 font-bold uppercase tracking-tighter transition-all';

    const variantClasses = {
      primary: 'bg-primary text-text-dark',
      gold: 'bg-gold text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-text-dark',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      new: 'bg-white/90 backdrop-blur text-text-dark',
      bestseller: 'bg-text-dark text-white',
    };

    const sizeClasses = {
      sm: 'text-[8px] px-2 py-0.5',
      md: 'text-[10px] px-3 py-1',
      lg: 'text-xs px-4 py-1.5',
    };

    const roundedClasses = rounded ? 'rounded-full' : 'rounded';

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses,
      className
    );

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <span ref={ref} className={classes} role="status" {...props}>
        {icon && (
          <span className="material-symbols-outlined text-current">
            {typeof icon === 'string' ? icon : icon}
          </span>
        )}

        {children && <span>{children}</span>}

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="material-symbols-outlined text-current hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            close
          </button>
        )}
      </span>
    );
  }
);

export const Badge = React.memo(BadgeComponent);

Badge.displayName = 'Badge';
