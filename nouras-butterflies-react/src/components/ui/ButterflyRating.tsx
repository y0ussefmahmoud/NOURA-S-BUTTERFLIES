import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface ButterflyRatingProps {
  className?: string;
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  max?: number;
  variant?: 'default' | 'labeled' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  labels?: string[];
}

const ratingLabels = {
  1: 'Basic',
  2: 'Nice',
  3: 'Glowing',
  4: 'Luminous',
  5: 'Radiant',
};

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

const labelSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const ButterflyRating: React.FC<ButterflyRatingProps> = ({
  className,
  value,
  onChange,
  readonly = false,
  max = 5,
  variant = 'default',
  size = 'md',
  labels = Object.values(ratingLabels),
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (readonly) return;
      setHoverValue(index + 1);
    },
    [readonly]
  );

  const handleMouseLeave = useCallback(() => {
    if (readonly) return;
    setHoverValue(null);
  }, [readonly]);

  const handleClick = useCallback(
    (index: number) => {
      if (readonly || !onChange) return;
      onChange(index + 1);
    },
    [readonly, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (readonly || !onChange) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(index + 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        onChange(Math.min(value + 1, max));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        onChange(Math.max(value - 1, 1));
      }
    },
    [readonly, onChange, value, max]
  );

  const displayValue = hoverValue !== null ? hoverValue : value;
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        {
          'flex-col gap-2': variant === 'labeled' && !isCompact,
          'gap-0.5': isCompact,
        },
        className
      )}
      role="radiogroup"
      aria-label={`Rating: ${value} out of ${max} butterflies`}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const isActive = index < displayValue;
        const isHovered = hoverValue !== null && index < hoverValue;

        return (
          <div
            key={index}
            className={cn('relative inline-flex flex-col items-center', {
              'cursor-pointer': !readonly,
              'cursor-default': readonly,
            })}
          >
            <span
              className={cn(
                'material-symbols-outlined transition-all duration-200 select-none',
                sizeClasses[size],
                {
                  'text-[#C8A962] drop-shadow-[0_0_8px_rgba(201,169,97,0.4)]': isActive,
                  'text-gray-300 dark:text-gray-600': !isActive,
                  'text-[#c8a95f] drop-shadow-[0_0_12px_rgba(201,169,97,0.6)] scale-110':
                    isHovered && !isActive,
                  'hover:scale-110': !readonly,
                  'focus:outline-none focus:ring-2 focus:ring-[#C8A962] focus:ring-offset-2 rounded':
                    !readonly,
                }
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={readonly ? -1 : 0}
              role="radio"
              aria-checked={isActive}
              aria-label={`${index + 1} ${labels[index] || 'butterfly'}${isActive ? ', selected' : ''}`}
            >
              {isActive ? 'flutter_dash' : 'flutter_dash'}
            </span>

            {variant === 'labeled' && !isCompact && labels[index] && (
              <span
                className={cn(
                  'text-gray-600 dark:text-gray-400 mt-1 font-medium transition-colors duration-200',
                  labelSizeClasses[size],
                  {
                    'text-[#C8A962] font-semibold': isActive,
                    'hover:text-[#C8A962]': !readonly && !isActive,
                  }
                )}
              >
                {labels[index]}
              </span>
            )}
          </div>
        );
      })}

      {variant === 'default' && !isCompact && (
        <span
          className={cn(
            'ml-2 text-gray-600 dark:text-gray-400 font-medium',
            labelSizeClasses[size]
          )}
        >
          {ratingLabels[value as keyof typeof ratingLabels] || `${value}/${max}`}
        </span>
      )}
    </div>
  );
};

ButterflyRating.displayName = 'ButterflyRating';
