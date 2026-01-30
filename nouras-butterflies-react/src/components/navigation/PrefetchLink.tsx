import React from 'react';
import { Link } from 'react-router-dom';
import { useRoutePrefetch } from '@/hooks/useRoutePrefetch';

interface PrefetchLinkProps {
  to: string;
  chunkName: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
}

// Link component with intelligent prefetching
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  to,
  chunkName,
  children,
  className = '',
  disabled = false,
  preloadOnHover = true,
  preloadOnVisible = false,
}) => {
  const { prefetchHandlers } = useRoutePrefetch(chunkName, undefined, {
    disabled,
    preloadOnVisible,
  });

  return (
    <Link
      to={to}
      className={className}
      {...(preloadOnHover
        ? {
            onMouseEnter: prefetchHandlers.onMouseEnter,
            onMouseLeave: prefetchHandlers.onMouseLeave,
            onFocus: prefetchHandlers.onFocus,
            onBlur: prefetchHandlers.onBlur,
            onTouchStart: prefetchHandlers.onTouchStart,
          }
        : {})}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;
