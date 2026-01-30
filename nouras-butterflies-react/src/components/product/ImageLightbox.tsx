import React, { useState, useEffect } from 'react';
import type { ProductImage } from '../../types/product';

interface ImageLightboxProps {
  images: ProductImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed(!isZoomed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="Close lightbox"
      >
        <span className="material-symbols-rounded text-2xl">close</span>
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors duration-200"
            aria-label="Previous image"
          >
            <span className="material-symbols-rounded text-2xl">chevron_left</span>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors duration-200"
            aria-label="Next image"
          >
            <span className="material-symbols-rounded text-2xl">chevron_right</span>
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className={`max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
          }`}
          onClick={handleImageClick}
        />
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                index === currentIndex
                  ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black'
                  : 'border-transparent hover:border-white/50'
              }`}
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white/70 text-sm">
        <p>Click image to zoom • Arrow keys to navigate • ESC to close</p>
      </div>
    </div>
  );
};
