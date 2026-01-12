import React, { useMemo } from 'react';

const MOBILE_BREAKPOINT = 768;
const PAN_DURATION = 20000;
const TRANSITION_TIMING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const FIRST_IMAGE_SCALE = 1.2;
const OTHER_IMAGES_SCALE = 1.2;

const getMobileImage = (images: string[], index: number) => {
  if (index === 0) {
    return images[index];
  }
  return images[index];
};

const getTransformStyles = (isMobile: boolean, currentIndex: number, index: number, scale: number): React.CSSProperties => {
  if (isMobile) {
    if (index === 0) {
      return {
        transform: 'translateX(-15%) scale(1.2)',
        transition: `opacity 2500ms ${TRANSITION_TIMING}`,
        willChange: 'opacity'
      };
    }
    return {
      transform: `translateX(${currentIndex === index ? '-300px' : '0px'}) scale(1.2)`,
      transition: `transform ${PAN_DURATION}ms ease-out, opacity 2500ms ${TRANSITION_TIMING}`,
      willChange: 'transform, opacity'
    };
  }
  return {
    transform: `scale(${index === 0 ? FIRST_IMAGE_SCALE : scale * OTHER_IMAGES_SCALE})`,
    transition: `transform 1s ${TRANSITION_TIMING}, opacity 1.5s ${TRANSITION_TIMING}`,
    willChange: 'transform, opacity'
  };
};

interface BackgroundSlideshowProps {
  images: string[];
  currentIndex: number;
  calculateScale: () => number;
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({ 
  images, 
  currentIndex, 
  calculateScale 
}) => {
  const isMobile = useMemo(() => window.innerWidth < MOBILE_BREAKPOINT, []);
  const scale = useMemo(() => calculateScale(), [calculateScale]);

  const getBaseStyles = (imageIndex: number): React.CSSProperties => ({
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: imageIndex === 0 && isMobile ? 'brightness(0.65)' : 'brightness(0.75) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    zIndex: imageIndex === 0 ? -1 : -2,
    ...(isMobile
      ? {
          width: '100%',
          height: '100%',
          left: '0',
          top: '0',
          position: 'fixed',
          objectFit: imageIndex === 0 ? 'cover' : 'cover',
          objectPosition: imageIndex === 0 ? 'center right' : 'center'
        }
      : {
          width: '100%',
          height: '100%'
        })
  });

  return (
    <>
      {images.map((image, index) => (
        <img
          key={index}
          className="fixed inset-0 background-slideshow-image w-full h-full object-cover"
          src={isMobile ? getMobileImage(images, index) : image}
          alt={`Kralj Residence luksuzni stanovi u Vrnjačkoj Banji - ${index + 1}`}
          loading={index === 0 ? "eager" : "lazy"}
          decoding={index === 0 ? "sync" : "async"}
          importance={index === 0 ? "high" : "auto"}
          style={{
            opacity: currentIndex === index ? 1 : 0,
            ...getBaseStyles(index),
            ...getTransformStyles(isMobile, currentIndex, index, scale),
          }}
        />
      ))}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" 
        style={{ 
          zIndex: -1,
          backgroundAttachment: 'fixed'
        }} 
      />
    </>
  );
};

export default BackgroundSlideshow;