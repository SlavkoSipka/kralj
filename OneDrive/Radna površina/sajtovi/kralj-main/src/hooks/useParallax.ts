import { useCallback, useMemo } from 'react';

interface ParallaxOptions {
  baseScale?: number;
  maxScale?: number;
  scrollRange?: number;
  easing?: (t: number) => number;
}

export const useParallax = (scrollPosition: number, options: ParallaxOptions = {}) => {
  const {
    baseScale = 1.2,
    maxScale = 1.8,
    scrollRange = 500,
    easing = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // Quadratic easing
  } = options;

  const progress = useMemo(() => {
    const rawProgress = Math.min(scrollPosition, scrollRange) / scrollRange;
    return easing(rawProgress);
  }, [scrollPosition, scrollRange, easing]);
  const calculateScale = useCallback(() => (
    baseScale + progress * (maxScale - baseScale)
  ), [progress, baseScale, maxScale]);

  const calculateTextOpacity = useCallback(() => (
    Math.max(0, 1 - progress)
  ), [progress]);

  const calculateTextTransform = useCallback(() => (
    `translateY(${scrollPosition * 0.3}px)`
  ), [scrollPosition]);

  return { calculateScale, calculateTextOpacity, calculateTextTransform };
};