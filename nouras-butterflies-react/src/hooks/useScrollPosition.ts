import { useState, useEffect } from 'react';

export interface UseScrollPositionReturn {
  scrollPercentage: number;
  scrollY: number;
  scrollHeight: number;
  clientHeight: number;
  isScrolled: boolean;
  isScrolledPast: (percentage: number) => boolean;
}

export const useScrollPosition = (): UseScrollPositionReturn => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollState({
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      });
    };

    // Initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Add resize listener to update dimensions
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const { scrollY, scrollHeight, clientHeight } = scrollState;

  // Calculate scroll percentage (0-100)
  const scrollPercentage =
    scrollHeight > clientHeight ? Math.round((scrollY / (scrollHeight - clientHeight)) * 100) : 0;

  // Check if page is scrolled (more than 50px)
  const isScrolled = scrollY > 50;

  // Helper function to check if scrolled past a certain percentage
  const isScrolledPast = (percentage: number) => {
    return scrollPercentage >= percentage;
  };

  return {
    scrollPercentage,
    scrollY,
    scrollHeight,
    clientHeight,
    isScrolled,
    isScrolledPast,
  };
};
