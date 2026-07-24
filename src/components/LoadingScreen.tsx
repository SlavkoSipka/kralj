import React, { useEffect, useState, useCallback } from 'react';

const LOADING_DURATION = 600;
const BACKGROUND_IMAGES = [
  '/images/Rudjinci A2.webp',
  '/images/A15.webp',
  '/images/A9.webp',
];

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const preloadImages = useCallback(async () => {
    const total = BACKGROUND_IMAGES.length;
    let loaded = 0;

    await Promise.all(
      BACKGROUND_IMAGES.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            const done = () => {
              loaded += 1;
              setProgress((loaded / total) * 100);
              resolve();
            };
            const t = setTimeout(done, 2500);
            img.onload = () => {
              clearTimeout(t);
              done();
            };
            img.onerror = () => {
              clearTimeout(t);
              done();
            };
            img.src = src;
          })
      )
    );
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let fallback: ReturnType<typeof setTimeout>;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setIsVisible(false);
      onLoadingComplete?.();
    };

    preloadImages().then(() => {
      timer = setTimeout(finish, LOADING_DURATION);
    });

    fallback = setTimeout(finish, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [preloadImages, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
      <div className="relative">
        <img
          src="/images/Beli logo2.webp"
          alt="Kralj Residence Logo"
          className="h-32 animate-pulse"
          style={{ animationDuration: '1000ms' }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-0.5 bg-[#D4AF37]/30 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#D4AF37] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
