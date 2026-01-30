import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
  disabled?: boolean;
  className?: string;
}

type TooltipPosition = NonNullable<TooltipProps['position']>;

const getViewportBounds = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 150,
  maxWidth = '260px',
  disabled = false,
  className,
}) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: position });
  const showTimeout = useRef<number | null>(null);
  const hideTimeout = useRef<number | null>(null);

  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  const clearTimers = () => {
    if (showTimeout.current !== null) window.clearTimeout(showTimeout.current);
    if (hideTimeout.current !== null) window.clearTimeout(hideTimeout.current);
  };

  const showTooltip = () => {
    if (disabled) return;
    clearTimers();
    showTimeout.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimers();
    hideTimeout.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 80);
  };

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = getViewportBounds();

    const placements: TooltipPosition[] = [position, 'top', 'bottom', 'right', 'left'];

    const calculate = (placement: TooltipPosition) => {
      const gap = 10;
      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - gap;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + gap;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - gap;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + gap;
          break;
        default:
          break;
      }

      return { top, left, placement };
    };

    const fits = (candidate: { top: number; left: number }) => {
      return (
        candidate.top >= 8 &&
        candidate.left >= 8 &&
        candidate.top + tooltipRect.height <= viewport.height - 8 &&
        candidate.left + tooltipRect.width <= viewport.width - 8
      );
    };

    let selected = calculate(position);
    for (const placement of placements) {
      const candidate = calculate(placement);
      if (fits(candidate)) {
        selected = candidate;
        break;
      }
    }

    const adjustedLeft = Math.min(
      Math.max(selected.left, 8),
      viewport.width - tooltipRect.width - 8
    );
    const adjustedTop = Math.min(
      Math.max(selected.top, 8),
      viewport.height - tooltipRect.height - 8
    );

    setCoords({
      top: adjustedTop + window.scrollY,
      left: adjustedLeft + window.scrollX,
      placement: selected.placement,
    });
  }, [isVisible, position]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => () => clearTimers(), []);

  const tooltip = isVisible
    ? createPortal(
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={cn(
            'z-[100] rounded-xl border border-accent-pink/30 bg-white/95 text-sm text-text-dark shadow-lg backdrop-blur',
            'px-4 py-3 transition-opacity duration-200 animate-fadeIn',
            'dark:bg-surface-dark dark:text-text-light',
            className
          )}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth,
            position: 'absolute',
          }}
        >
          <span
            className={cn(
              'absolute h-2 w-2 rotate-45 border border-accent-pink/30 bg-white/95',
              'dark:bg-surface-dark',
              coords.placement === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2',
              coords.placement === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2',
              coords.placement === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2',
              coords.placement === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2'
            )}
          />
          <div className={cn(isRtl && 'text-right')}>{content}</div>
        </div>,
        document.body
      )
    : null;

  const child = React.isValidElement<React.HTMLAttributes<HTMLElement>>(children)
    ? React.cloneElement(children, {
        'aria-describedby': !disabled ? tooltipId : undefined,
      })
    : children;

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocusCapture={showTooltip}
      onBlurCapture={hideTooltip}
    >
      {child}
      {tooltip}
    </span>
  );
};
