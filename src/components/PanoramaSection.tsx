import { useState, lazy, Suspense } from 'react';
import SectionHeading from './SectionHeading';
import {
  PANORAMA_ORTHO_IMAGE,
  PANORAMA_HOTSPOTS,
  type PanoramaHotspot,
} from '../constants/panoramas';

const PanoramaViewer = lazy(() => import('./PanoramaViewer'));

/**
 * Interaktivna mapa dvorišta sa 360° tačkama.
 * Automatski se sakriva ako ortofoto mapa još ne postoji na serveru.
 */
const PanoramaSection = () => {
  const [active, setActive] = useState<PanoramaHotspot | null>(null);
  const [mapMissing, setMapMissing] = useState(false);

  if (mapMissing || PANORAMA_HOTSPOTS.length === 0) return null;

  return (
    <section className="section-dark overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionHeading
          eyebrow="Virtuelni obilazak"
          title="Prošetajte kompleksom iz vazduha"
          subtitle="Kliknite na zlatnu tačku na mapi i pogledajte dvorište u 360° — okrećite pogled, zumirajte i doživite Kralj Residence kao da ste tu."
        />

        <div className="scroll-animate mt-14">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl2 border border-gold/25 shadow-royal">
            <img
              src={PANORAMA_ORTHO_IMAGE}
              alt="Kralj Residence — dvorište iz ptičije perspektive"
              className="w-full"
              loading="lazy"
              decoding="async"
              onError={() => setMapMissing(true)}
            />

            {PANORAMA_HOTSPOTS.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setActive(h)}
                aria-label={`Otvori 360 pogled: ${h.label}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                {/* Pulsirajući prsten */}
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream-100/80 bg-gold text-sm font-bold text-night shadow-lg transition-transform duration-300 group-hover:scale-125 md:h-10 md:w-10">
                  {i + 1}
                </span>
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-night/90 px-3 py-1.5 text-xs uppercase tracking-wider text-cream-100 opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 group-hover:opacity-100 md:block">
                  {h.label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-ts-p text-cream-100/60">
            {PANORAMA_HOTSPOTS.length} panoramskih tačaka · snimljeno Insta360 kamerom
          </p>
        </div>
      </div>

      {active && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-night/95">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          }
        >
          <PanoramaViewer hotspot={active} onClose={() => setActive(null)} />
        </Suspense>
      )}
    </section>
  );
};

export default PanoramaSection;
