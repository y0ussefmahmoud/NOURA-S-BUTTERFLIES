import { useState, useEffect } from 'react';

const FIRST_VISIT_KEY = 'nouras-visited';

export interface UseFirstVisitReturn {
  isFirstVisit: boolean;
  markAsVisited: () => void;
  resetVisit: () => void;
}

export const useFirstVisit = (): UseFirstVisitReturn => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY) === 'true';
    setIsFirstVisit(!hasVisited);
  }, []);

  const markAsVisited = () => {
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    setIsFirstVisit(false);
  };

  const resetVisit = () => {
    localStorage.removeItem(FIRST_VISIT_KEY);
    setIsFirstVisit(true);
  };

  return {
    isFirstVisit,
    markAsVisited,
    resetVisit,
  };
};
