import React, { useRef, useState } from 'react';
import type { FilterState } from '../../types/catalog';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  activeFilterCount?: number;
  disabled?: boolean;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
  activeFilterCount = 0,
  disabled = false,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Drag to close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStartY(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - dragStartY;

    // Only allow downward drag
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum drag distance to close
    const velocity = dragOffset / 10; // Simple velocity calculation

    if (dragOffset > threshold || velocity > 5) {
      handleClose();
    } else {
      // Spring back animation
      setDragOffset(0);
    }

    setIsDragging(false);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
      setDragOffset(0);
    }, 300);
  };

  const handleReset = () => {
    onReset();
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleApply = () => {
    handleClose();
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-black z-50 lg:hidden
          transform transition-transform duration-300 ease-out
          ${isAnimating ? 'translate-y-full' : ''}
          ${isDragging && dragOffset > 0 ? 'translate-y-full' : ''}
          ${!isAnimating && !isDragging && open ? 'translate-y-0' : ''}
          ${!open && !isAnimating ? 'translate-y-full' : ''}
        `}
        style={{
          transform: isDragging && dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Drag Handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#eacdd2] dark:border-[#3d322d]">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full animate-scale-in">
                  {activeFilterCount}
                </span>
              )}
            </h2>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-black/20 rounded-full transition-colors touch-target"
              aria-label="Close filters"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>

          {/* Search Bar for Filters */}
          <div className="p-4 border-b border-[#eacdd2] dark:border-[#3d322d]">
            <input
              type="text"
              placeholder="Search filters..."
              className="w-full px-4 py-2 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Recently Used Section */}
          {activeFilterCount > 0 && (
            <div className="p-4 border-b border-[#eacdd2] dark:border-[#3d322d]">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Recently Used
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Price: Low to High
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  In Stock
                </span>
              </div>
            </div>
          )}

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onReset={onReset}
              className="static top-0"
              disabled={disabled}
            />
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#eacdd2] dark:border-[#3d322d] space-y-3">
            {/* Results Count */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">24</span> products
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={disabled || activeFilterCount === 0}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                disabled={disabled}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};
