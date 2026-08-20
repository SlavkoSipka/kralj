import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import type { PanoramaHotspot } from '../constants/panoramas';

interface PanoramaViewerProps {
  hotspot: PanoramaHotspot;
  onClose: () => void;
}

/** Fullscreen 360° viewer (lazy-loaded — učitava se tek kada se otvori). */
const PanoramaViewer = ({ hotspot, onClose }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: hotspot.image,
      navbar: ['zoom', 'fullscreen'],
      defaultZoomLvl: 0,
      loadingTxt: 'Učitavanje panorame…',
      lang: {
        zoom: 'Zum',
        zoomIn: 'Uvećaj',
        zoomOut: 'Umanji',
        fullscreen: 'Ceo ekran',
        loadError: 'Slika ne može da se učita',
      },
    });
    return () => viewer.destroy();
  }, [hotspot.image]);

  // Esc zatvara + zaključaj skrol stranice
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] bg-night/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">360° pogled</p>
          <p className="heading mt-1 text-ts-h6 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
            {hotspot.label}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Zatvori"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-night/90 text-gold shadow-lg backdrop-blur transition-all duration-300 hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div ref={containerRef} className="h-full w-full" />

      <p className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-night/70 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-cream-100/80 backdrop-blur">
        Prevucite za rotaciju
      </p>
    </div>
  );
};

export default PanoramaViewer;
