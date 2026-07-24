import React, { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const TRANSITION_TIMING = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface BackgroundSlideshowProps {
  images: string[];
  currentIndex: number;
  calculateScale: () => number;
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  images,
  currentIndex,
  calculateScale,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const scale = calculateScale();

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      {images.map((image, index) => {
        const isActive = currentIndex === index;
        const shouldLoad = index === 0 || Math.abs(index - currentIndex) <= 1;

        if (!shouldLoad && !isActive) return null;

        return (
          <img
            key={image}
            className="fixed inset-0 background-slideshow-image w-full h-full object-cover"
            src={image}
            alt={`Kralj Residence - ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'low'}
            style={{
              opacity: isActive ? 1 : 0,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.8)',
              zIndex: isActive ? -1 : -2,
              width: '100%',
              height: '100%',
              transform: isMobile
                ? 'scale(1.05)'
                : `scale(${index === 0 ? 1.1 : scale * 1.1})`,
              transition: `opacity 1.2s ${TRANSITION_TIMING}, transform 0.8s ${TRANSITION_TIMING}`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
      <div
        className="fixed inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50 pointer-events-none"
        style={{ zIndex: -1 }}
      />
    </>
  );
};

export default React.memo(BackgroundSlideshow);
