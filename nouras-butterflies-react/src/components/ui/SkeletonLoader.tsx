import React from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy = true,
}) => {
  const getStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      animation: 'pulse 1.5s ease-in-out infinite',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: variant === 'circle' ? '50%' : '4px',
    };

    if (width) {
      baseStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
      baseStyle.width = variant === 'text' ? '100%' : '40px';
    }

    if (height) {
      baseStyle.height = typeof height === 'number' ? `${height}px` : height;
    } else {
      switch (variant) {
        case 'text':
          baseStyle.height = '1em';
          break;
        case 'circle':
          baseStyle.height = baseStyle.width;
          break;
        case 'rectangle':
          baseStyle.height = '100px';
          break;
        case 'card':
          baseStyle.height = '200px';
          break;
      }
    }

    return baseStyle;
  };

  const renderSkeleton = () => {
    if (variant === 'text' && lines > 1) {
      return (
        <div style={{ width: '100%' }} role="status" aria-busy={ariaBusy}>
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              style={{
                ...getStyle(),
                marginBottom: index < lines - 1 ? '0.5em' : '0',
                width: index === lines - 1 ? '70%' : '100%', // Last line shorter
              }}
              className={className}
            />
          ))}
          {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        </div>
      );
    }

    return (
      <div
        style={getStyle()}
        className={className}
        role="status"
        aria-busy={ariaBusy}
        aria-label={ariaLabel}
      />
    );
  };

  return <>{renderSkeleton()}</>;
};

// Card skeleton for product cards
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-card ${className}`}
      role="status"
      aria-busy
      aria-label="Loading product"
    >
      <SkeletonLoader variant="rectangle" height={200} className="skeleton-image" />
      <div style={{ padding: '1rem' }}>
        <SkeletonLoader variant="text" height={24} className="skeleton-title" />
        <SkeletonLoader variant="text" width="60%" className="skeleton-price" />
        <SkeletonLoader variant="text" lines={2} className="skeleton-description" />
      </div>
    </div>
  );
};

// Grid skeleton for product grids
export const ProductGridSkeleton: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 8, className = '' }) => {
  return (
    <div
      className={`skeleton-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem',
      }}
      role="status"
      aria-busy
      aria-label={`Loading ${items} products`}
    >
      {Array.from({ length: items }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Checkout skeleton
export const CheckoutSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`skeleton-checkout ${className}`}
      role="status"
      aria-busy
      aria-label="Loading checkout"
    >
      <div style={{ marginBottom: '2rem' }}>
        <SkeletonLoader variant="text" height={32} width="40%" className="skeleton-heading" />
        <SkeletonLoader variant="text" lines={3} className="skeleton-content" />
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <SkeletonLoader variant="text" height={32} width="40%" className="skeleton-heading" />
        <SkeletonLoader variant="rectangle" height={100} className="skeleton-form" />
      </div>
      <div>
        <SkeletonLoader variant="text" height={32} width="40%" className="skeleton-heading" />
        <SkeletonLoader variant="rectangle" height={150} className="skeleton-summary" />
      </div>
    </div>
  );
};
