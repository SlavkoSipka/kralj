import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (threshold = 0.12, rootMargin = '0px 0px -8% 0px') => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );

    const observeAll = () => {
      document
        .querySelectorAll('.scroll-animate:not(.animate-in)')
        .forEach((el) => observerRef.current?.observe(el));
    };

    observeAll();

    // Sadržaj koji stiže naknadno (npr. iz baze) mora takođe da se registruje
    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);
};
