import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

interface PanoramaViewerProps {
  /** 360 slika (equirectangular) koja se prikazuje */
  image: string;
  /** Slike koje se posle prve tiho preuzmu u pozadini, da prelaz između tačaka bude trenutan */
  preload?: string[];
}

/** Ostale panorame se preuzimaju jedna po jedna; preskače se kada korisnik štedi mobilne podatke */
const preloadAll = async (viewer: Viewer, images: string[]) => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  for (const src of images) {
    try {
      await viewer.textureLoader.preloadPanorama(src);
    } catch {
      // slika koja ne može da se preuzme učitaće se tek kada se klikne
    }
  }
};

/**
 * 360° plejer ugrađen u stranicu: prevlačenjem mišem ili prstom se okreće pogled.
 * Viewer se pravi jednom, a promena tačke samo menja sliku uz prelaz.
 */
const PanoramaViewer = ({ image, preload = [] }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const preloadRef = useRef(preload);
  const preloadStarted = useRef(false);

  // Viewer se pravi bez slike; sliku zadaje efekat ispod
  useEffect(() => {
    if (!containerRef.current) return;
    const viewer = new Viewer({
      container: containerRef.current,
      // na telefonu se zumira štipanjem, pa tamo ostaje samo dugme za ceo ekran
      navbar: window.matchMedia('(min-width: 768px)').matches ? ['zoom', 'fullscreen'] : ['fullscreen'],
      defaultZoomLvl: 0,
      // točkić miša skroluje stranicu, a zum ide dugmićima ili štipanjem prstima
      mousewheel: false,
      loadingTxt: 'Učitavanje panorame...',
      lang: {
        zoom: 'Zum',
        zoomIn: 'Uvećaj',
        zoomOut: 'Umanji',
        fullscreen: 'Ceo ekran',
        loadError: 'Slika ne može da se učita',
      },
    });
    viewerRef.current = viewer;
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    /*
     * Slika se zadaje tik posle pravljenja plejera. U razvojnom režimu React napravi plejer, uništi ga
     * i napravi ponovo, a biblioteka spaja istovremene zahteve za istu sliku u jedan; prekinut zahtev
     * prvog plejera bi tako ostavio drugi bez prve slike. Odlaganje za jedan tick to sprečava.
     */
    const timer = window.setTimeout(() => {
      const viewer = viewerRef.current;
      if (cancelled || !viewer || viewer.config.panorama === image) return;
      viewer
        .setPanorama(image, { transition: { speed: 1000, rotation: false }, showLoader: true })
        .then((loaded) => {
          if (!loaded || preloadStarted.current) return;
          preloadStarted.current = true;
          preloadAll(viewer, preloadRef.current.filter((src) => src !== image));
        })
        .catch(() => {
          // plejer sam prikazuje poruku da slika ne može da se učita
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default PanoramaViewer;
