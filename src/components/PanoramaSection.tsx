import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Move } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { PANORAMA_MAP_IMAGE, PANORAMA_HOTSPOTS } from '../constants/panoramas';

const PanoramaViewer = lazy(() => import('./PanoramaViewer'));

const Spinner = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
  </div>
);

/**
 * Virtuelni obilazak dvorišta: mapa odozgo sa tačkama i 360° plejer pored nje.
 * Klik na tačku menja sliku u plejeru.
 */
const PanoramaSection = () => {
  const [activeId, setActiveId] = useState(PANORAMA_HOTSPOTS[0]?.id);
  const [nearView, setNearView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Plejer (biblioteka od oko 600 KB) se učitava tek kada je sekcija blizu ekrana
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (PANORAMA_HOTSPOTS.length === 0) return null;

  const active = PANORAMA_HOTSPOTS.find((h) => h.id === activeId) ?? PANORAMA_HOTSPOTS[0];
  const activeNumber = PANORAMA_HOTSPOTS.indexOf(active) + 1;

  return (
    <section ref={sectionRef} className="section-dark overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <SectionHeading
          eyebrow="Virtuelni obilazak"
          title="Prošetajte dvorištem u 360°"
          subtitle="Izaberite tačku na mapi i okrećite pogled kao da stojite u dvorištu Kralj Residence."
        />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* 360 plejer */}
          <div className="relative overflow-hidden rounded-xl2 border border-gold/25 bg-night shadow-royal lg:order-2">
            <div className="aspect-[4/3] sm:aspect-[16/10]">
              {active.image ? (
                nearView ? (
                  <Suspense fallback={<Spinner />}>
                    <PanoramaViewer image={active.image} />
                  </Suspense>
                ) : (
                  <Spinner />
                )
              ) : (
                <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <div
                    className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-sm"
                    style={{ backgroundImage: `url("${PANORAMA_MAP_IMAGE}")` }}
                  />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-sm font-semibold text-gold">
                    360°
                  </span>
                  <p className="heading relative text-ts-h6 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
                    360° snimak ove tačke stiže uskoro
                  </p>
                  <p className="relative text-sm uppercase tracking-[0.16em] text-cream-100/60">{active.label}</p>
                </div>
              )}
            </div>

            {/* Trenutna tačka */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-night/85 px-4 py-2 backdrop-blur md:left-4 md:top-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Tačka {activeNumber}</span>
              <span className="text-sm text-cream-100">{active.label}</span>
            </div>

            {active.image && (
              <p className="pointer-events-none absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-night/75 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cream-100/85 backdrop-blur">
                <Move className="h-3.5 w-3.5 text-gold" />
                Prevucite da okrenete pogled
              </p>
            )}
          </div>

          {/* Mapa odozgo sa tačkama */}
          <div className="lg:order-1">
            <div className="relative overflow-hidden rounded-xl2 border border-gold/25 shadow-royal">
              <img
                src={PANORAMA_MAP_IMAGE}
                alt="Kralj Residence, dvorište iz ptičije perspektive"
                className="block h-auto w-full"
                width={1287}
                height={816}
                loading="lazy"
                decoding="async"
              />

              {PANORAMA_HOTSPOTS.map((h, i) => {
                const isActive = h.id === active.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveId(h.id)}
                    aria-label={`360 pogled: ${h.label}`}
                    aria-pressed={isActive}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />}
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg transition-all duration-300 md:h-9 md:w-9 ${
                        isActive
                          ? 'scale-110 border-cream-100 bg-gold text-night'
                          : 'border-gold bg-night/80 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-night'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-night/90 px-3 py-1.5 text-xs uppercase tracking-wider text-cream-100 opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 group-hover:opacity-100 md:block">
                      {h.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Spisak tačaka, lakši za dodir na telefonu */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PANORAMA_HOTSPOTS.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveId(h.id)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-left text-xs uppercase tracking-wider transition ${
                    h.id === active.id
                      ? 'border-gold bg-gold text-night'
                      : 'border-gold/30 text-cream-100/80 hover:border-gold hover:text-gold'
                  }`}
                >
                  <span className="font-bold">{i + 1}</span>
                  <span className="truncate">{h.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanoramaSection;
