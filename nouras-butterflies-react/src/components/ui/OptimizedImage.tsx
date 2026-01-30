import { useEffect, useRef, useState } from 'react';
import {
  generateOptimizedUrl,
  generateSrcSet,
  generateSizes,
  generateLQIP,
  generatePictureSources,
  preloadImage,
  DEFAULT_BREAKPOINTS,
} from '@/utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  // Responsive image props
  responsive?: boolean;
  breakpoints?: typeof DEFAULT_BREAKPOINTS;
  aspectRatio?: string;
  // Advanced optimization props
  enableAvif?: boolean;
  enableWebp?: boolean;
  lqip?: boolean;
  preload?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  objectFit = 'cover',
  quality = 75,
  sizes,
  onLoad,
  onError,
  fetchPriority = priority ? 'high' : 'auto',
  decoding = priority ? 'sync' : 'async',
  responsive = false,
  breakpoints = DEFAULT_BREAKPOINTS,
  aspectRatio,
  enableAvif = true,
  enableWebp = true,
  lqip = true,
  preload = priority,
}: OptimizedImageProps) => {
  // Force eager loading for priority images
  const actualLoading = priority ? 'eager' : loading;
  const actualDecoding = priority ? 'sync' : decoding;
  const actualFetchPriority = priority ? 'high' : fetchPriority;
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (responsive ? generateSizes(undefined, breakpoints) : '100vw');

  // Generate srcset for responsive images
  const srcSet = responsive
    ? generateSrcSet(src, { quality }, Object.values(breakpoints))
    : undefined;

  // Generate LQIP (Low Quality Image Placeholder)
  const lqipSrc = lqip && !isLoaded ? generateLQIP(src) : undefined;

  // Generate picture sources for modern formats
  const pictureSources =
    enableAvif || enableWebp
      ? generatePictureSources(src, { quality }, Object.values(breakpoints))
      : [];

  // Preload critical images
  useEffect(() => {
    if (preload && src && !priority) {
      preloadImage(src, { quality }).catch(() => {
        // Silent fail for preloading
      });
    }
  }, [preload, src, quality, priority]);

  // Set up intersection observer for lazy loading (skip for priority images)
  useEffect(() => {
    if (priority || actualLoading === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '200px', // Increased from 50px for earlier loading
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [actualLoading, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Generate final image URL
  const getFinalImageUrl = () => {
    if (hasError) return src; // Fallback to original on error
    if (!isLoaded && lqipSrc) return lqipSrc;
    return generateOptimizedUrl(src, { quality, width, height });
  };

  // If there's an error, fall back to the original image
  if (hasError) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit, aspectRatio }}
        loading={loading}
        decoding={decoding}
      />
    );
  }

  // Use picture element for modern formats
  if (pictureSources.length > 0) {
    return (
      <picture>
        {pictureSources.map((source, index) => (
          <source key={index} type={source.type} srcSet={source.srcSet} sizes={responsiveSizes} />
        ))}

        {/* Fallback image */}
        <img
          ref={imgRef}
          src={
            isLoaded
              ? getFinalImageUrl()
              : lqipSrc ||
                'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMSkiPjwvc3ZnPg=='
          }
          alt={alt}
          width={width}
          height={height}
          loading={actualLoading}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ objectFit, aspectRatio }}
          onLoad={handleLoad}
          onError={handleError}
          sizes={responsiveSizes}
          srcSet={srcSet}
          decoding={actualDecoding}
          fetchPriority={actualFetchPriority}
        />
      </picture>
    );
  }

  // Simple img element fallback
  return (
    <img
      ref={imgRef}
      src={
        isLoaded
          ? getFinalImageUrl()
          : lqipSrc ||
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMSkiPjwvc3ZnPg=='
      }
      alt={alt}
      width={width}
      height={height}
      loading={actualLoading}
      className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={{ objectFit, aspectRatio }}
      onLoad={handleLoad}
      onError={handleError}
      sizes={responsiveSizes}
      srcSet={srcSet}
      decoding={decoding}
      fetchPriority={fetchPriority}
    />
  );
};

export default OptimizedImage;
