import { useState, useCallback, useEffect, useRef } from 'react';

export const useScroll = (threshold = 50, scrollIndicatorThreshold = 100) => {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const ticking = useRef(false);

  const handleScroll = useCallback((): void => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
    const position = window.scrollY;
    setScrollPosition(position);
    setScrolled(position > threshold);
    setShowScrollIndicator(position < scrollIndicatorThreshold);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [threshold, scrollIndicatorThreshold]);

  useEffect(() => {
    const options = { passive: true };
    window.addEventListener('scroll', handleScroll, options);
    handleScroll();
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll, options);
  }, [handleScroll]);

  return { scrolled, showScrollIndicator, scrollPosition };
};