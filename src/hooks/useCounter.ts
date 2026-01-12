import { useEffect, useRef, useState, useCallback } from 'react';

export const useCounter = (end: number, duration: number = 3500) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animate = useCallback((timestamp: number, startTimestamp: number | null = null) => {
    if (!startTimestamp) {
      startTimestamp = timestamp;
    }
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    setCount(Math.floor(progress * end));
    
    if (progress < 1) {
      requestAnimationFrame((newTimestamp) => animate(newTimestamp, startTimestamp));
    }
  }, [end, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            requestAnimationFrame((timestamp) => animate(timestamp));
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, animate]);

  return { count, countRef };
};