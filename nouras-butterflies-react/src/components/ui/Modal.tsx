import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from '../../types/components';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * Modal component with overlay and animations
 */
const ModalBase = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      open,
      onClose,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      preventScroll = true,
      overlayClassName,
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { announce } = useAnnouncer();

    const { containerRef, activate, deactivate } = useFocusTrap({
      isActive: open,
      restoreFocus: true,
      onEscape: closeOnEscape ? onClose : undefined,
    });

    // Merge refs
    const mergedRef = (node: HTMLDivElement) => {
      modalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      if (containerRef && typeof containerRef === 'object' && 'current' in containerRef) {
        (containerRef as React.RefObject<HTMLDivElement>).current = node;
      }
    };

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw]',
    };

    // Generate unique IDs for accessibility
    const modalId = React.useId();
    const titleId = `modal-title-${modalId}`;
    const descriptionId = `modal-description-${modalId}`;

    // Handle body scroll lock
    useEffect(() => {
      if (preventScroll && open) {
        document.body.style.overflow = 'hidden';
        setIsVisible(true);
      } else {
        document.body.style.overflow = '';
        setIsVisible(false);
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [open, preventScroll]);

    // Announce modal opening/closing to screen readers
    useEffect(() => {
      if (open && title) {
        announce(`Modal opened: ${title}`, 'polite');
      } else if (!open && isVisible) {
        announce('Modal closed', 'polite');
      }
    }, [open, title, isVisible, announce]);

    // Handle animation
    useEffect(() => {
      if (open) {
        setIsAnimating(true);
        // Activate focus trap after animation starts
        const timer = setTimeout(() => {
          activate();
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setIsAnimating(false);
        deactivate();
        const timer = setTimeout(() => setIsVisible(false), 200);
        return () => clearTimeout(timer);
      }
    }, [open, activate, deactivate]);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    if (!open && !isAnimating) {
      return null;
    }

    const modalContent = (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-safe-top pb-safe-bottom">
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-background-dark/40 backdrop-blur-sm transition-opacity duration-200',
            overlayClassName,
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={mergedRef}
          className={cn(
            'relative w-full max-h-[90vh] bg-white dark:bg-surface-dark rounded-xl shadow-2xl transition-all duration-200 overflow-hidden',
            sizeClasses[size],
            open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        >
          {/* Visually hidden live region for announcements */}
          <VisuallyHidden>
            <div role="status" aria-live="polite" aria-atomic="true">
              {open ? 'Modal open' : 'Modal closed'}
            </div>
          </VisuallyHidden>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close modal"
            >
              <span
                className="material-symbols-outlined text-text-muted hover:text-text-dark"
                aria-hidden="true"
              >
                close
              </span>
            </button>
          )}

          {/* Modal title for screen readers if not provided in header */}
          {title &&
            !React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === ModalHeader
            ) && (
              <VisuallyHidden>
                <h2 id={titleId}>{title}</h2>
              </VisuallyHidden>
            )}

          {/* Modal description for screen readers if not provided in body */}
          {description &&
            !React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === ModalBody
            ) && (
              <VisuallyHidden>
                <p id={descriptionId}>{description}</p>
              </VisuallyHidden>
            )}

          {children}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

ModalBase.displayName = 'Modal';

/**
 * Modal Header sub-component
 */
export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const modalId = React.useId();
    const titleId = `modal-title-${modalId}`;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark',
          className
        )}
        {...props}
      >
        <h2 id={titleId} className="text-xl font-semibold text-text-dark dark:text-text-light">
          {children}
        </h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-text-muted hover:text-text-dark transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close modal"
          >
            <span aria-hidden="true">close</span>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

/**
 * Modal Body sub-component
 */
export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    const modalId = React.useId();
    const descriptionId = `modal-description-${modalId}`;

    return (
      <div
        ref={ref}
        id={descriptionId}
        className={cn('p-6 max-h-[70vh] overflow-y-auto', className)}
        role="document"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

/**
 * Modal Footer sub-component
 */
export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 p-6 border-t border-border-light dark:border-border-dark',
          className
        )}
        role="group"
        aria-label="Modal actions"
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

// Attach sub-components to Modal
const ModalWithSubComponents = ModalBase as typeof ModalBase & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

ModalWithSubComponents.Header = ModalHeader;
ModalWithSubComponents.Body = ModalBody;
ModalWithSubComponents.Footer = ModalFooter;

export { ModalWithSubComponents as Modal };
