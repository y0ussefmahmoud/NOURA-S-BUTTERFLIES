import React from 'react';
import type { ButtonProps } from '../../types/components';
import { cn } from '../../utils/cn';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * Button component with multiple variants and sizes
 *
 * @param variant - Visual style of the button
 * @param size - Size of the button
 * @param fullWidth - Whether button should take full width
 * @param disabled - Whether button is disabled
 * @param loading - Whether button is in loading state
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param pressed - Whether button is pressed (toggle buttons)
 * @param expanded - Whether button controls expanded state
 * @param describedBy - ID of element that describes this button
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      pressed,
      expanded,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]';

    const variantClasses = {
      primary:
        'bg-primary text-text-dark shadow-butterfly-glow hover:scale-[1.02] active:scale-[0.98]',
      secondary:
        'bg-surface-light dark:bg-surface-dark text-text-dark dark:text-text-light hover:bg-primary/20',
      outline: 'border-2 border-primary text-text-dark dark:text-text-light hover:bg-primary/10',
      ghost: 'text-text-dark dark:text-text-light hover:text-primary hover:bg-primary/10',
      icon: 'min-w-[44px] min-h-[44px] p-3 rounded-full hover:bg-primary/20',
    };

    const sizeClasses = {
      sm: 'px-6 py-[10px] text-sm min-h-[44px] min-w-[44px]',
      md: 'px-8 py-3 text-base min-h-[48px] min-w-[48px]',
      lg: 'px-10 py-4 text-lg min-h-[52px] min-w-[52px]',
    };

    const iconSizeClasses = {
      sm: 'text-base w-11 h-11',
      md: 'text-lg w-12 h-12',
      lg: 'text-xl w-14 h-14',
    };

    const isIconOnly = variant === 'icon';

    // Generate appropriate aria-label based on button content and state
    const generateAriaLabel = (): string => {
      if (ariaLabel) {
        if (loading) return `${ariaLabel} - loading`;
        return ariaLabel;
      }

      if (isIconOnly && typeof children === 'string') {
        const iconName = children;
        if (loading) return `${iconName} - loading`;
        return iconName;
      }

      if (typeof children === 'string') {
        const buttonText = children.trim();
        if (loading) return `${buttonText} - loading`;
        return buttonText;
      }

      if (loading) return 'Loading';
      return '';
    };

    let finalAriaLabel = generateAriaLabel();
    if (isIconOnly && !finalAriaLabel) {
      console.warn('Icon-only Button requires an aria-label for accessibility.');
      finalAriaLabel = 'Icon button';
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      variant !== 'icon' && sizeClasses[size],
      variant === 'icon' && iconSizeClasses[size],
      fullWidth && 'w-full',
      variant !== 'icon' && 'rounded-xl',
      className
    );

    // Build ARIA attributes
    const ariaAttributes: Record<string, any> = {
      'aria-disabled': disabled || loading,
      'aria-busy': loading,
      'aria-label': finalAriaLabel || undefined,
    };

    if (ariaDescribedBy) {
      ariaAttributes['aria-describedby'] = ariaDescribedBy;
    }

    if (pressed !== undefined) {
      ariaAttributes['aria-pressed'] = pressed;
    }

    if (expanded !== undefined) {
      ariaAttributes['aria-expanded'] = expanded;
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...ariaAttributes}
        {...props}
      >
        {loading && (
          <>
            <span className="material-symbols-outlined animate-spin mr-2" aria-hidden="true">
              refresh
            </span>
            <VisuallyHidden>Loading</VisuallyHidden>
          </>
        )}

        {!loading && leftIcon && (
          <span className="material-symbols-outlined mr-2" aria-hidden="true">
            {typeof leftIcon === 'string' ? leftIcon : leftIcon}
          </span>
        )}

        {variant !== 'icon' && children}

        {!loading && rightIcon && (
          <span className="material-symbols-outlined ml-2" aria-hidden="true">
            {typeof rightIcon === 'string' ? rightIcon : rightIcon}
          </span>
        )}

        {variant === 'icon' && !loading && (
          <span className="material-symbols-outlined" aria-hidden="true">
            {typeof children === 'string' ? children : children}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
