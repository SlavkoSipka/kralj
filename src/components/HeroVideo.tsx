import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  /** Snimci (bez zvuka) koji se puštaju redom i ukrug; jedan snimak se samo ponavlja */
  videos: string[];
  /** Sličica koja se vidi odmah, dok video ne krene */
  poster: string;
}

/**
 * Pozadinski video hero sekcije (vertikalni za telefon, horizontalni za računar).
 * Poster se vidi odmah; sledeći snimak se preuzima tek kada prethodni krene, a video se pauzira
 * kada hero nije na ekranu. Kada telefon štedi podatke ili korisnik ne želi animacije, ostaje poster.
 */
const HeroVideo = ({ videos, poster }: HeroVideoProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [allowed] = useState(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !saveData && !reducedMotion;
  });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Prvi snimak kreće odmah; muted se postavlja i kao svojstvo, inače ga iOS ne pusti sam
  useEffect(() => {
    const first = videoRefs.current[0];
    if (!allowed || !first) return;
    first.muted = true;
    first.play().catch(() => undefined);
  }, [allowed]);

  // Pauza kada hero nije na ekranu, nastavak kada se vrati
  useEffect(() => {
    const el = wrapRef.current;
    if (!allowed || !el) return;
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRefs.current[activeRef.current];
      if (!video) return;
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowed]);

  // Dok jedan snimak ide, preuzmi sledeći da prelaz bude bez čekanja
  const handlePlaying = (i: number) => {
    const next = videoRefs.current[(i + 1) % videos.length];
    if (next && next.preload === 'none') {
      next.preload = 'auto';
      next.load();
    }
  };

  const handleEnded = (i: number) => {
    const n = (i + 1) % videos.length;
    const next = videoRefs.current[n];
    if (!next) return;
    next.currentTime = 0;
    next.muted = true;
    next.play().catch(() => undefined);
    setActive(n);
  };

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-night" aria-hidden="true">
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" decoding="async" />
      {allowed &&
        videos.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
            src={src}
            muted
            playsInline
            loop={videos.length === 1}
            autoPlay={i === 0}
            preload={i === 0 ? 'auto' : 'none'}
            onPlaying={() => handlePlaying(i)}
            onEnded={() => handleEnded(i)}
          />
        ))}
    </div>
  );
};

export default HeroVideo;
