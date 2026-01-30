import React from 'react';
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardImageProps,
} from '../../types/components';
import { cn } from '../../utils/cn';

// Create Card interface with sub-components
interface CardComponent extends React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Image: typeof CardImage;
}

/**
 * Card component with variants and sub-components
 */
const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'transition-all duration-300';

    const variantClasses = {
      default: 'bg-white dark:bg-white/5 rounded-2xl shadow-soft-card',
      elevated:
        'bg-white dark:bg-white/5 rounded-2xl shadow-soft-card hover:shadow-lg transition-shadow',
      outlined: 'bg-transparent border-2 border-border-light dark:border-border-dark rounded-2xl',
      ghost: 'bg-transparent',
    };

    const paddingClasses = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverClasses = hoverable ? 'hover:-translate-y-2 hover:shadow-butterfly-glow' : '';
    const clickableClasses = clickable
      ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      : '';

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      clickableClasses,
      className
    );

    const handleClick = () => {
      if (clickable && onClick) {
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        className={classes}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBase.displayName = 'Card';

/**
 * Card Header sub-component
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    const classes = cn(
      'mb-4',
      divider && 'pb-4 border-b border-border-light dark:border-border-dark',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Body sub-component
 */
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * Card Footer sub-component
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    const classes = cn(
      'mt-4',
      divider && 'pt-4 border-t border-border-light dark:border-border-dark',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * Card Image sub-component
 */
export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, aspectRatio = 'square', ...props }, ref) => {
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
    };

    const classes = cn(
      'w-full object-cover rounded-t-2xl',
      aspectRatioClasses[aspectRatio],
      className
    );

    return <img ref={ref} src={src} alt={alt} className={classes} {...props} />;
  }
);

CardImage.displayName = 'CardImage';

// Attach sub-components to Card with proper typing
const CardWithSubComponents = CardBase as CardComponent;
CardWithSubComponents.Header = CardHeader;
CardWithSubComponents.Body = CardBody;
CardWithSubComponents.Footer = CardFooter;
CardWithSubComponents.Image = CardImage;

export { CardWithSubComponents as Card };
