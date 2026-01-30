import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<Element>;
  isVisible: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true, root = null } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<Element>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, root]);

  return { ref, isVisible };
};

interface UseMultipleIntersectionObserverReturn {
  refs: RefObject<Element>[];
  visibleStates: boolean[];
  setRef: (index: number) => (el: Element | null) => void;
}

export const useMultipleIntersectionObserver = (
  count: number,
  options: UseIntersectionObserverOptions = {}
): UseMultipleIntersectionObserverReturn => {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true, root = null } = options;
  const [visibleStates, setVisibleStates] = useState<boolean[]>(new Array(count).fill(false));
  const refs = useRef<(Element | null)[]>(new Array(count).fill(null));

  const setRef = (index: number) => (el: Element | null) => {
    refs.current[index] = el;
  };

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.indexOf(entry.target);
          if (index !== -1) {
            if (entry.isIntersecting) {
              setVisibleStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
              if (triggerOnce) {
                observer.unobserve(entry.target);
              }
            } else if (!triggerOnce) {
              setVisibleStates((prev) => {
                const newStates = [...prev];
                newStates[index] = false;
                return newStates;
              });
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    elements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [count, threshold, rootMargin, triggerOnce, root]);

  return { refs: refs.current as RefObject<Element>[], visibleStates, setRef };
};
