import React, { useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface DrawerIdsContextValue {
  titleId: string;
  descriptionId: string;
}

const DrawerIdsContext = React.createContext<DrawerIdsContextValue | null>(null);

export interface DrawerProps {
  className?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  width?: string;
  height?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
}

const DrawerBase = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      open,
      onClose,
      position = 'right',
      width = '480px',
      height = '480px',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      preventScroll = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const drawerId = useId();
    const titleId = `drawer-title-${drawerId}`;
    const descriptionId = `drawer-description-${drawerId}`;

    const { containerRef } = useFocusTrap({
      isActive: open,
      restoreFocus: true,
      onEscape: closeOnEscape ? onClose : undefined,
    });

    const handleDrawerRef = (node: HTMLDivElement | null) => {
      drawerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      if (containerRef && typeof containerRef === 'object' && 'current' in containerRef) {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    };

    const getPositionClasses = () => {
      switch (position) {
        case 'left':
          return {
            container: 'justify-start',
            drawer: 'left-0 h-full w-full max-w-[480px]',
            animation: open ? 'translate-x-0' : '-translate-x-full',
          };
        case 'right':
          return {
            container: 'justify-end',
            drawer: 'right-0 h-full w-full max-w-[480px]',
            animation: open ? 'translate-x-0' : 'translate-x-full',
          };
        case 'top':
          return {
            container: 'items-start',
            drawer: 'top-0 w-full h-full max-h-[480px]',
            animation: open ? 'translate-y-0' : '-translate-y-full',
          };
        case 'bottom':
          return {
            container: 'items-end',
            drawer: 'bottom-0 w-full h-full max-h-[480px]',
            animation: open ? 'translate-y-0' : 'translate-y-full',
          };
      }
    };

    const positionClasses = getPositionClasses();

    // Handle body scroll lock
    useEffect(() => {
      if (preventScroll && open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [open, preventScroll]);

    // Handle animation
    useEffect(() => {
      if (open) {
        setIsAnimating(true);
      } else {
        const timer = setTimeout(() => setIsAnimating(false), 200);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Handle swipe gestures for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      const threshold = 50;

      // Check swipe direction based on drawer position
      if (position === 'right' && deltaX > threshold) {
        onClose();
      } else if (position === 'left' && deltaX < -threshold) {
        onClose();
      } else if (position === 'bottom' && deltaY < -threshold) {
        onClose();
      } else if (position === 'top' && deltaY > threshold) {
        onClose();
      }

      touchStartRef.current = null;
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    if (!open && !isAnimating) {
      return null;
    }

    const drawerContent = (
      <div
        className={`fixed inset-0 z-50 flex ${positionClasses.container} p-0 pt-safe-top pb-safe-bottom`}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-background-dark/40 backdrop-blur-sm transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleOverlayClick}
        />

        {/* Drawer Content */}
        <div
          ref={handleDrawerRef}
          className={cn(
            'fixed bg-white dark:bg-surface-dark shadow-2xl transition-transform duration-300 ease-in-out',
            positionClasses.drawer,
            positionClasses.animation,
            className
          )}
          style={{
            width: position === 'left' || position === 'right' ? width : undefined,
            height: position === 'top' || position === 'bottom' ? height : undefined,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          {...props}
        >
          <DrawerIdsContext.Provider value={{ titleId, descriptionId }}>
            {children}
          </DrawerIdsContext.Provider>
        </div>
      </div>
    );

    return createPortal(drawerContent, document.body);
  }
);

DrawerBase.displayName = 'Drawer';

// Drawer Header sub-component
export interface DrawerHeaderProps {
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const ids = React.useContext(DrawerIdsContext);
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark',
          className
        )}
        {...props}
      >
        <h2 id={ids?.titleId} className="text-xl font-semibold text-text-dark dark:text-text-light">
          {children}
        </h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-text-muted hover:text-text-dark transition-colors"
            aria-label="Close drawer"
          >
            close
          </button>
        )}
      </div>
    );
  }
);

DrawerHeader.displayName = 'DrawerHeader';

// Drawer Body sub-component
export interface DrawerBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, children, ...props }, ref) => {
    const ids = React.useContext(DrawerIdsContext);
    return (
      <div
        ref={ref}
        id={ids?.descriptionId}
        className={cn('flex-1 overflow-y-auto p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerBody.displayName = 'DrawerBody';

// Drawer Footer sub-component
export interface DrawerFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-3 p-6 border-t border-border-light dark:border-border-dark',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerFooter.displayName = 'DrawerFooter';

// Attach sub-components to Drawer
const DrawerWithSubComponents = DrawerBase as typeof DrawerBase & {
  Header: typeof DrawerHeader;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
};

DrawerWithSubComponents.Header = DrawerHeader;
DrawerWithSubComponents.Body = DrawerBody;
DrawerWithSubComponents.Footer = DrawerFooter;

export { DrawerWithSubComponents as Drawer };
