import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we've scrolled past the threshold
      const scrolled = currentScrollY > 10;
      setIsScrolled(scrolled);

      // Only update direction if we've scrolled more than 5px to avoid jittery behavior
      if (Math.abs(currentScrollY - lastScrollYRef.current) > 5) {
        const newDirection = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
        setScrollDirection(newDirection);
        lastScrollYRef.current = currentScrollY;
      }
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial scroll position
    lastScrollYRef.current = window.scrollY;

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    scrollDirection,
    isScrolled,
    shouldHideHeader: scrollDirection === 'down' && isScrolled,
  };
};
