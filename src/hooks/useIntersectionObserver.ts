import { useEffect, useCallback, useRef } from 'react';

export const useIntersectionObserver = (threshold = 0.1, rootMargin = '50px') => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const target = entry.target;
      
      requestAnimationFrame(() => {
        target.style.opacity = entry.isIntersecting ? '' : '0';
        target.classList[entry.isIntersecting ? 'add' : 'remove']('animate-in');
      });
    });
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, { 
      threshold,
      rootMargin,
    });

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin, handleIntersection]);
};