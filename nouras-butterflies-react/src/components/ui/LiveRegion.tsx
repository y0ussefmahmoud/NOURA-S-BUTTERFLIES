import React, { useEffect, useRef, useState, forwardRef, useCallback } from 'react';

type LiveRegionType = 'polite' | 'assertive';

interface LiveRegionProps {
  type?: LiveRegionType;
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  busy?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export const LiveRegion = forwardRef<HTMLDivElement, LiveRegionProps>(
  (
    {
      type = 'polite',
      atomic = false,
      relevant = 'additions text',
      busy = false,
      className = '',
      children,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
      if (children && ref && 'current' in ref && ref.current) {
        const newContent = typeof children === 'string' ? children : ref.current.textContent || '';
        if (newContent !== content) {
          setContent(newContent);
          ref.current.textContent = newContent;
        }
      }
    }, [children, content, ref]);

    const getAriaAttributes = () => {
      const attributes: Record<string, string | boolean> = {
        'aria-live': type,
        'aria-atomic': atomic,
        'aria-relevant': relevant,
        'aria-busy': busy,
      };

      if (ariaLabel) {
        attributes['aria-label'] = ariaLabel;
      }

      return attributes;
    };

    return (
      <div
        ref={ref}
        className={`live-region live-region--${type} ${className}`}
        {...getAriaAttributes()}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      >
        {children}
      </div>
    );
  }
);

LiveRegion.displayName = 'LiveRegion';

// Hook for creating live regions programmatically
export const useLiveRegion = (type: LiveRegionType = 'polite') => {
  const regionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const announce = useCallback(
    (message: string) => {
      if (regionRef.current && isMounted) {
        regionRef.current.textContent = message;

        // Clear the message after a delay to prevent screen reader clutter
        setTimeout(() => {
          if (regionRef.current && regionRef.current.textContent === message) {
            regionRef.current.textContent = '';
          }
        }, 1000);
      }
    },
    [isMounted]
  );

  const clear = useCallback(() => {
    if (regionRef.current) {
      regionRef.current.textContent = '';
    }
  }, []);

  const LiveRegionComponent = useCallback(
    ({ children, ...props }: Omit<LiveRegionProps, 'type'>) => (
      <LiveRegion ref={regionRef} type={type} {...props}>
        {children}
      </LiveRegion>
    ),
    [type]
  );

  return {
    announce,
    clear,
    LiveRegion: LiveRegionComponent,
    regionRef,
  };
};
