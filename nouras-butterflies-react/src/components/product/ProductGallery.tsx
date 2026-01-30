import React, { useState, useRef, useEffect } from 'react';
import { ProductBadge } from './ProductBadge';
import type { ProductImage, ProductBadge as ProductBadgeType } from '../../types/product';
import { useBreakpoint } from '../../utils/responsive';

interface ProductGalleryProps {
  images: ProductImage[];
  badges?: ProductBadgeType[];
  onImageClick?: (index: number) => void;
  showThumbnails?: boolean;
  thumbnailPosition?: 'left' | 'bottom';
  enablePinchZoom?: boolean;
  enableSwipeGestures?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  badges = [],
  onImageClick,
  showThumbnails = true,
  thumbnailPosition = 'left',
  enablePinchZoom = true,
  enableSwipeGestures = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [pinchDistance, setPinchDistance] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const breakpoint = useBreakpoint();

  // Determine thumbnail position based on breakpoint
  const currentThumbnailPosition =
    breakpoint === 'mobileLg' || breakpoint === 'sm' ? 'bottom' : thumbnailPosition;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Enhanced touch handlers for mobile swipe with momentum
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;

    const touch = e.touches[0];
    setTouchEnd(null);
    setTouchStart(touch.clientX);

    // Handle pinch zoom
    if (enablePinchZoom && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;

    const touch = e.touches[0];
    setTouchEnd(touch.clientX);

    // Handle pinch zoom
    if (enablePinchZoom && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (pinchDistance > 0) {
        const scale = distance / pinchDistance;
        const newZoomLevel = Math.min(Math.max(zoomLevel * scale, 1), 3);
        setZoomLevel(newZoomLevel);
        setIsZoomed(newZoomLevel > 1);
      }
      setPinchDistance(distance);
    } else if (isZoomed && e.touches.length === 1) {
      // Handle panning when zoomed (simplified version)
      const deltaX = touch.clientX - panPosition.x;
      const deltaY = touch.clientY - panPosition.y;
      setPanPosition({ x: panPosition.x + deltaX * 0.1, y: panPosition.y + deltaY * 0.1 });
    }
  };

  const handleTouchEnd = () => {
    if (!enableSwipeGestures || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const velocity = Math.abs(distance) / 10; // Simple velocity calculation
    const threshold = 50;
    const momentumThreshold = 5;

    // Check for swipe with momentum
    if (Math.abs(distance) > threshold || velocity > momentumThreshold) {
      const isLeftSwipe = distance > 0;

      if (isLeftSwipe) {
        handleNext();
      } else {
        handlePrevious();
      }

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }

    setPinchDistance(0);
  };

  // Double tap to zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!enablePinchZoom) return;

    e.preventDefault();
    if (isZoomed) {
      setZoomLevel(1);
      setIsZoomed(false);
      setPanPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(2);
      setIsZoomed(true);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleMainImageClick = () => {
    onImageClick?.(activeIndex);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderThumbnails = () => {
    if (!showThumbnails || images.length <= 1) return null;

    const position = currentThumbnailPosition;

    const thumbnailClasses =
      position === 'left'
        ? 'hidden md:flex flex-col gap-4 w-20 order-1'
        : 'flex gap-2 md:gap-4 mt-4 order-2 overflow-x-auto';

    const thumbnailButtonClasses =
      position === 'left'
        ? 'relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0'
        : 'relative aspect-square w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0';

    return (
      <div className={thumbnailClasses}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`${thumbnailButtonClasses} scroll-snap-align-start ${
              activeIndex === index
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-transparent hover:border-primary/50'
            }`}
            aria-label={`View image ${index + 1}`}
            aria-current={activeIndex === index}
          >
            <img
              src={image.thumbnail || image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    );
  };

  const renderMainImage = () => {
    const position = currentThumbnailPosition;
    const mainImageClasses = position === 'left' ? 'flex-1 order-2' : 'order-1';

    return (
      <div className={mainImageClasses}>
        <div
          ref={mainImageRef}
          className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 cursor-zoom-in group touch-pan-y"
          onClick={handleMainImageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          {/* Main Image with zoom and pan */}
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <img
              ref={imageRef}
              src={images[activeIndex]?.url}
              alt={images[activeIndex]?.alt}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease-out',
              }}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Badges Overlay */}
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {badges.map((badge, index) => (
                <ProductBadge key={index} badge={badge} />
              ))}
            </div>
          )}

          {/* Navigation Arrows - Hidden on mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white touch-target"
                aria-label="Previous image"
              >
                <span className="material-symbols-rounded">chevron_left</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white touch-target"
                aria-label="Next image"
              >
                <span className="material-symbols-rounded">chevron_right</span>
              </button>
            </>
          )}

          {/* Mobile Pagination Dots */}
          {images.length > 1 && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={activeIndex === index}
                />
              ))}
            </div>
          )}

          {/* Image Counter - Desktop only */}
          {images.length > 1 && (
            <div className="hidden md:block absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Zoom Indicator - Enhanced */}
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="material-symbols-rounded text-sm">
              {isZoomed ? 'zoom_out' : 'zoom_in'}
            </span>
          </div>

          {/* Zoom Level Indicator */}
          {isZoomed && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  const containerClasses = thumbnailPosition === 'left' ? 'flex gap-6' : 'flex flex-col';

  // Reset zoom when image changes
  useEffect(() => {
    setZoomLevel(1);
    setIsZoomed(false);
    setPanPosition({ x: 0, y: 0 });
  }, [activeIndex]);

  return (
    <div
      className={containerClasses}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Product gallery"
    >
      {renderThumbnails()}
      {renderMainImage()}
    </div>
  );
};
