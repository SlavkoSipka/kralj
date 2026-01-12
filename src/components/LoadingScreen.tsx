import React, { useEffect, useState, useCallback } from 'react';

const LOADING_DURATION = 1500; // Increased from 800ms to 1500ms
const BACKGROUND_IMAGES = [
  "http://aislike.rs/Kralj1/Rudjinci A2.jpg",
  "http://aislike.rs/Kralj1/A15.png",
  "http://aislike.rs/Kralj1/A9.png",
];

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [forceComplete, setForceComplete] = useState(false);

  const preloadImages = useCallback(async () => {
    const loadImage = (src: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => resolve(null), 5000); // Timeout after 5s
        img.src = src;
        img.onload = () => {
          clearTimeout(timeout);
          resolve(null);
        };
      });
    };

    const totalImages = BACKGROUND_IMAGES.length;
    let loadedImages = 0;

    for (const src of BACKGROUND_IMAGES) {
      await loadImage(src);
      loadedImages++;
      setProgress((loadedImages / totalImages) * 100);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const init = async () => {
      await preloadImages();
      
      timer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, LOADING_DURATION);
    };

    init();
    
    // Fallback timer to force complete after 10 seconds
    const fallbackTimer = setTimeout(() => {
      setForceComplete(true);
    }, 5000); // Increased from 3000ms to 5000ms

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [preloadImages, onLoadingComplete]);

  useEffect(() => {
    if (forceComplete) {
      setIsVisible(false);
      onLoadingComplete?.();
    }
  }, [forceComplete, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700">
      <div className="relative">
        <img 
          src="http://aislike.rs/Kralj1/Beli logo2.png"
          alt="Kralj Residence Logo"
          className="h-32 animate-pulse" style={{ animationDuration: '1000ms' }}
          loading="eager" 
          decoding="sync"
          importance="high"
        />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-0.5 bg-[#D4AF37]/30 relative overflow-hidden rounded-full">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#D4AF37] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;