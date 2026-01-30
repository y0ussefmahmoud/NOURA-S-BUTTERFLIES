// Image optimization utilities for performance enhancement

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number | string;
  height?: number | string;
  format?: 'avif' | 'webp' | 'original';
  fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

// Default breakpoints for responsive images
export const DEFAULT_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Generate optimized image URL with CDN parameters
export const generateOptimizedUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  if (!src) return '';

  // Return external URLs as-is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }

  const { quality = 75, width, height, format = 'webp', fit = 'cover' } = options;

  // Remove leading slash if present
  const cleanPath = src.startsWith('/') ? src.slice(1) : src;

  // Get CDN URL from environment
  const cdnUrl = import.meta.env?.VITE_CDN_URL || '';

  // Build query parameters
  const params = new URLSearchParams();

  // Add format-specific parameters
  if (format !== 'original' && !src.endsWith('.svg') && !src.endsWith('.gif')) {
    params.set('fm', format);
  }

  // Add quality
  if (quality !== 75) {
    params.set('q', quality.toString());
  }

  // Add dimensions
  if (width && width !== 'auto') {
    params.set('w', width.toString());
  }

  if (height && height !== 'auto') {
    params.set('h', height.toString());
  }

  // Add fit
  if (fit !== 'cover') {
    params.set('fit', fit);
  }

  // Build final URL
  const baseUrl = `${cdnUrl}/${cleanPath}`;
  const queryString = params.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Generate srcset for responsive images
export const generateSrcSet = (
  src: string,
  options: ImageOptimizationOptions = {},
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536, 1920]
): string => {
  return sizes
    .map((size) => {
      const optimizedUrl = generateOptimizedUrl(src, {
        ...options,
        width: size,
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = (
  customSizes?: string,
  breakpoints: typeof DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS
): string => {
  if (customSizes) return customSizes;

  return `(max-width: ${breakpoints.sm}px) 100vw, (max-width: ${breakpoints.md}px) 50vw, (max-width: ${breakpoints.lg}px) 33vw, 25vw`;
};

// Generate low-quality image placeholder (LQIP)
export const generateLQIP = (src: string, width: number = 64, height: number = 64): string => {
  return generateOptimizedUrl(src, {
    width,
    height,
    quality: 20,
    format: 'webp',
  });
};

// Generate AVIF, WebP, and fallback sources
export const generatePictureSources = (
  src: string,
  options: ImageOptimizationOptions = {},
  sizes?: number[]
) => {
  const sources = [];

  // AVIF source (best compression, modern browsers)
  if (!src.endsWith('.svg') && !src.endsWith('.gif')) {
    sources.push({
      type: 'image/avif',
      srcSet: generateSrcSet(src, { ...options, format: 'avif' }, sizes),
    });
  }

  // WebP source (good compression, wide support)
  if (!src.endsWith('.svg') && !src.endsWith('.gif')) {
    sources.push({
      type: 'image/webp',
      srcSet: generateSrcSet(src, { ...options, format: 'webp' }, sizes),
    });
  }

  return sources;
};

// Check if image format is supported
export const isFormatSupported = (format: 'avif' | 'webp'): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return false;

  canvas.width = 1;
  canvas.height = 1;

  try {
    if (format === 'avif') {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } else if (format === 'webp') {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  } catch (e) {
    return false;
  }

  return false;
};

// Get optimal image format based on browser support
export const getOptimalFormat = (): 'avif' | 'webp' | 'original' => {
  if (isFormatSupported('avif')) return 'avif';
  if (isFormatSupported('webp')) return 'webp';
  return 'original';
};

// Preload critical images
export const preloadImage = (
  src: string,
  options: ImageOptimizationOptions = {}
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = generateOptimizedUrl(src, options);

    img.onload = () => resolve(img);
    img.onerror = reject;

    // Start loading
    img.src = optimizedSrc;
  });
};

// Preload multiple images in parallel
export const preloadImages = (
  images: Array<{ src: string; options?: ImageOptimizationOptions }>
): Promise<HTMLImageElement[]> => {
  return Promise.all(images.map(({ src, options }) => preloadImage(src, options)));
};

export default {
  generateOptimizedUrl,
  generateSrcSet,
  generateSizes,
  generateLQIP,
  generatePictureSources,
  isFormatSupported,
  getOptimalFormat,
  preloadImage,
  preloadImages,
  DEFAULT_BREAKPOINTS,
};
