import React, { useState } from 'react';
import type { RatingProps } from '../../types/components';
import { cn } from '../../utils/cn';

/**
 * Rating component with display and input modes
 *
 * @param value - Current rating value (0-5)
 * @param max - Maximum rating value (default: 5)
 * @param precision - Rating precision (0.5 for half stars, 1 for full stars)
 * @param size - Size of the rating stars
 * @param readonly - Whether rating is read-only
 * @param onChange - Callback when rating changes
 * @param showValue - Whether to show the numeric value
 * @param reviewCount - Number of reviews to display
 * @param color - Color of the filled stars
 */
const RatingComponent = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      max = 5,
      precision = 1,
      size = 'md',
      readonly = false,
      onChange,
      showValue = false,
      reviewCount,
      color = 'text-gold',
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const iconSizes = {
      sm: '12px',
      md: '14px',
      lg: '16px',
    };

    const currentDisplayValue = hoverValue ?? value;
    const stars = Array.from({ length: max }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= currentDisplayValue;
      const isHalfFilled =
        precision === 0.5 &&
        starValue === Math.ceil(currentDisplayValue) &&
        currentDisplayValue % 1 !== 0;

      return { starValue, isFilled, isHalfFilled };
    });

    const handleStarClick = (starValue: number) => {
      if (!readonly && onChange) {
        onChange(starValue);
      }
    };

    const handleStarMouseEnter = (starValue: number) => {
      if (!readonly) {
        setHoverValue(starValue);
      }
    };

    const handleStarMouseLeave = () => {
      if (!readonly) {
        setHoverValue(null);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
      if (readonly) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStarClick(starValue);
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newValue =
          e.key === 'ArrowRight'
            ? Math.min(value + (precision === 0.5 ? 0.5 : 1), max)
            : Math.max(value - (precision === 0.5 ? 0.5 : 1), 0);
        if (onChange) {
          onChange(newValue);
        }
      }
    };

    const classes = cn('inline-flex items-center gap-1', sizeClasses[size], className);

    return (
      <div
        ref={ref}
        className={classes}
        role={readonly ? 'img' : 'radiogroup'}
        aria-label={readonly ? `Rating: ${value} out of ${max}` : 'Rating'}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        onMouseLeave={handleStarMouseLeave}
        {...props}
      >
        {stars.map(({ starValue, isFilled, isHalfFilled }) => (
          <button
            key={starValue}
            type="button"
            className={cn(
              'material-symbols-outlined transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded',
              readonly ? 'cursor-default' : 'cursor-pointer hover:opacity-80',
              isFilled ? color : 'text-gray-300 dark:text-gray-600'
            )}
            style={{ fontSize: iconSizes[size] }}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarMouseEnter(starValue)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
            disabled={readonly}
            role={readonly ? undefined : 'radio'}
            aria-checked={starValue === Math.ceil(value)}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            tabIndex={readonly ? -1 : 0}
          >
            {isHalfFilled ? 'star_half' : isFilled ? 'star' : 'star_outline'}
          </button>
        ))}

        {showValue && (
          <span className="ml-2 text-sm text-text-muted">
            {value.toFixed(precision === 0.5 ? 1 : 0)}
          </span>
        )}

        {reviewCount && (
          <span className="ml-2 text-sm text-text-muted">
            ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    );
  }
);

export const Rating = React.memo(RatingComponent);

Rating.displayName = 'Rating';
