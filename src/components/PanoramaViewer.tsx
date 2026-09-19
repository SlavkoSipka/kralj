import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

interface PanoramaViewerProps {
  /** 360 slika (equirectangular) */
  image: string;
}

/**
 * 360° plejer ugrađen u stranicu: prevlačenjem mišem ili prstom se okreće pogled.
 * Viewer se pravi jednom, a promena tačke samo menja sliku uz prelaz.
 * Učitava se lenjo (biblioteka je velika), tek kada je sekcija blizu ekrana.
 */
const PanoramaViewer = ({ image }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: image,
      navbar: ['zoom', 'fullscreen'],
      defaultZoomLvl: 0,
      // točkić miša skroluje stranicu; zum ide uz Ctrl, da plejer ne "zarobi" skrol
      mousewheelCtrlKey: true,
      loadingTxt: 'Učitavanje panorame...',
      lang: {
        zoom: 'Zum',
        zoomIn: 'Uvećaj',
        zoomOut: 'Umanji',
        fullscreen: 'Ceo ekran',
        ctrlZoom: 'Držite Ctrl i skrolujte za zum',
        loadError: 'Slika ne može da se učita',
      },
    });
    viewerRef.current = viewer;
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
    // viewer se pravi samo jednom; promenu slike radi efekat ispod
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.config.panorama === image) return;
    viewer.setPanorama(image, { transition: { speed: 1000, rotation: false }, showLoader: true });
  }, [image]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default PanoramaViewer;
