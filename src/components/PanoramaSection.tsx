import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Map as MapIcon, Move } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { PANORAMA_MAP_IMAGE, PANORAMA_HOTSPOTS } from '../constants/panoramas';

const PanoramaViewer = lazy(() => import('./PanoramaViewer'));

const Spinner = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
  </div>
);

/**
 * Plejer (biblioteka od oko 600 KB) i prva panorama počinju da se učitavaju čim se stranica učita,
 * pa su spremni dok se stigne do sekcije, a ne usporavaju prvi prikaz stranice.
 */
const usePageLoaded = () => {
  const [loaded, setLoaded] = useState(() => document.readyState === 'complete');
  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, [loaded]);
  return loaded;
};

const ALL_IMAGES = PANORAMA_HOTSPOTS.map((h) => h.image);

/** Skrol do elementa tako da ga fiksni meni ne prekrije (meni je 64 px, od 768 px širine 80 px) */
const scrollBelowNav = (el: HTMLElement | null) => {
  if (!el) return;
  const nav = window.innerWidth >= 768 ? 80 : 64;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - nav, behavior: 'smooth' });
};

/**
 * Virtuelni obilazak dvorišta: velika mapa sa numerisanim tačkama, a ispod 360° plejer preko cele
 * širine ekrana. Klik na tačku je osvetli, otvori njenu sliku u plejeru i spusti stranicu do plejera.
 */
const PanoramaSection = () => {
  const [active, setActive] = useState(0);
  const [dragged, setDragged] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const pageLoaded = usePageLoaded();

  const total = PANORAMA_HOTSPOTS.length;
  if (total === 0) return null;

  const current = PANORAMA_HOTSPOTS[active];
  const openFromMap = (i: number) => {
    setActive(i);
    scrollBelowNav(playerRef.current);
  };

  return (
    <section className="section-dark overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 md:px-10 md:pt-24">
        <SectionHeading
          eyebrow="Virtuelni obilazak"
          title="Prošetajte dvorištem u 360°"
          subtitle="Kliknite na broj na mapi i pogledajte to mesto u 360°. Pogled okrećete prevlačenjem."
        />

        {/* Velika mapa sa tačkama */}
        <div ref={mapRef} className="relative mt-10 overflow-hidden rounded-xl2 border border-gold/25 shadow-royal md:mt-12">
          <img
            src={PANORAMA_MAP_IMAGE}
            alt="Kralj Residence, dvorište iz ptičije perspektive sa tačkama 360° obilaska"
            className="block h-auto w-full"
            width={1287}
            height={816}
            loading="lazy"
            decoding="async"
          />

          {PANORAMA_HOTSPOTS.map((h, i) => {
            const isActive = i === active;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => openFromMap(i)}
                aria-label={`Otvori 360° pogled, tačka ${h.number}`}
                aria-pressed={isActive}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-20' : 'z-10'}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />}
                <span
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all duration-300 sm:h-9 sm:w-9 sm:text-sm lg:h-11 lg:w-11 lg:text-base ${
                    isActive
                      ? 'scale-110 border-cream-100 bg-gold text-night shadow-[0_0_24px_6px_rgba(201,162,74,0.75)]'
                      : 'border-gold bg-night/85 text-gold shadow-lg group-hover:scale-110 group-hover:bg-gold group-hover:text-night'
                  }`}
                >
                  {h.number}
                </span>
              </button>
            );
          })}
        </div>

        {/* Na telefonu su tačke na mapi sitne i neke blizu, pa ispod mape stoje i kao dugmad */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:hidden">
          {PANORAMA_HOTSPOTS.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => openFromMap(i)}
              aria-label={`Otvori 360° pogled, tačka ${h.number}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                i === active ? 'border-cream-100 bg-gold text-night' : 'border-gold/60 text-gold'
              }`}
            >
              {h.number}
            </button>
          ))}
        </div>
      </div>

      {/*
        360 plejer preko cele širine ekrana. Na računaru je visok ceo ekran ispod menija; na telefonu je
        niži, jer prevlačenje prstom po plejeru okreće pogled i ne skroluje stranicu.
      */}
      <div
        ref={playerRef}
        className="relative mt-8 h-[62svh] min-h-[340px] w-full bg-night md:mt-12 md:h-[calc(100svh-5rem)] md:min-h-[420px]"
        onPointerDown={() => setDragged(true)}
      >
        {pageLoaded ? (
          <Suspense fallback={<Spinner />}>
            <PanoramaViewer image={current.image} preload={ALL_IMAGES} />
          </Suspense>
        ) : (
          <Spinner />
        )}

        {/* Gore: trenutna tačka i povratak na mapu */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-3 md:p-5">
          <div className="flex items-center gap-2 rounded-full bg-night/85 px-4 py-2 backdrop-blur">
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-gold sm:inline">360° pogled</span>
            <span className="heading text-sm text-cream-100 md:text-base" style={{ fontFamily: 'Playfair Display' }}>
              Tačka {current.number}
            </span>
          </div>
          <button
            type="button"
            onClick={() => scrollBelowNav(mapRef.current)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-night/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold backdrop-blur transition hover:bg-night"
          >
            <MapIcon className="h-4 w-4" />
            Mapa
          </button>
        </div>

        {/* Brojevi tačaka */}
        <div className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full bg-night/80 p-1.5 backdrop-blur md:bottom-16 md:gap-1.5">
          {PANORAMA_HOTSPOTS.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Tačka ${h.number}`}
              aria-pressed={i === active}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition md:h-9 md:w-9 md:text-sm ${
                i === active ? 'bg-gold text-night' : 'text-cream-100/80 hover:bg-gold/20 hover:text-gold'
              }`}
            >
              {h.number}
            </button>
          ))}
        </div>

        {!dragged && (
          <p className="pointer-events-none absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-night/75 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cream-100/85 backdrop-blur md:bottom-32">
            <Move className="h-3.5 w-3.5 text-gold" />
            Prevucite da okrenete pogled
          </p>
        )}
      </div>
    </section>
  );
};

export default PanoramaSection;
