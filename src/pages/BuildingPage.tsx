import { useState, useEffect, useMemo, type ReactElement } from 'react';
import { useParams, useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { ChevronDown, Phone } from 'lucide-react';
import { SAMPLE_APARTMENT } from '../constants';
import { useModal } from '../hooks/useModal';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ApartmentModal from '../components/ApartmentModal';
import FloorSection from '../components/FloorSection';
import ContactSection from '../components/ContactSection';
import ThankYouModal from '../components/ThankYouModal';
import { useScroll } from '../hooks/useScroll';
import HeroVideo from '../components/HeroVideo';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useSeo } from '../hooks/useSeo';
import { apartmentPath, hasApartmentPages, type Building, type ApartmentRow } from '../lib/buildingsApi';
import { loadBuildingData } from '../lib/buildingData';

type HeroVideoSource = { videos: string[]; poster: string };

/** Hero video po zgradi: vertikalni za telefon, horizontalni za računar; bez videa ostaje slika zgrade */
const HERO_VIDEOS: Record<string, { mobile?: HeroVideoSource; desktop?: HeroVideoSource }> = {
  'vila-5': {
    // druga polovina snimka "hero vila 5", ponavlja se
    mobile: { videos: ['/videos/hero-vila-5.mp4'], poster: '/videos/posteri/hero-vila-5.webp' },
    // isečak 3:15 do 3:33 iz snimka "horizontal", ponavlja se
    desktop: { videos: ['/videos/hero-vila-5-horizontal.mp4'], poster: '/videos/posteri/hero-vila-5-horizontal.webp' },
  },
};

interface BuildingPageProps {
  /** Fiksni slug (za legacy rute /villa-4 itd.); ako izostane, čita se iz URL parametra. */
  slug?: string;
  /** Šta prikazati kada zgrada nije dostupna iz baze (legacy statička stranica). */
  fallback?: ReactElement;
}

const BuildingPage = ({ slug: slugProp, fallback }: BuildingPageProps) => {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug ?? '';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  /** Vila V i novi projekti: kartica vodi na stranicu stana. Stari projekti: popup. */
  const apartmentPages = hasApartmentPages(slug);

  const [isVisible, setIsVisible] = useState(false);
  const [, setIsLoading] = useState(true);
  const [building, setBuilding] = useState<Building | null>(null);
  const [apartments, setApartments] = useState<ApartmentRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [selected, setSelected] = useState<ApartmentRow | null>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const { isOpen, open, close } = useModal();
  const { scrolled, showScrollIndicator } = useScroll();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const heroVideo = HERO_VIDEOS[slug]?.[isMobile ? 'mobile' : 'desktop'];
  useIntersectionObserver();

  useSeo({
    title: building
      ? `${building.name} – prodaja stanova Vrnjačka Banja | Kralj Residence`
      : 'Prodaja stanova Vrnjačka Banja | Kralj Residence',
    description:
      building?.description ??
      'Novogradnja i direktna prodaja stanova u Vrnjačkoj Banji od investitora – Kralj Residence.',
    path: slugProp ? `/${slug}` : `/zgrada/${slug}`,
  });

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    loadBuildingData(slug).then((data) => {
      if (cancelled) return;
      if (!data) {
        setState('missing');
        return;
      }
      setBuilding(data.building);
      setApartments(data.apartments);
      setState('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (state === 'ready') {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Deep-link: /villa-4?stan=23 otvara popup, a /vila-5?stan=12 vodi na stranicu stana
  useEffect(() => {
    if (state !== 'ready') return;
    const stanParam = searchParams.get('stan');
    if (!stanParam) return;
    const target = apartments.find((a) => a.number === parseInt(stanParam, 10));
    if (target && apartmentPages) {
      navigate(apartmentPath(slug, target.number), { replace: true });
      return;
    }
    if (target) {
      setSelected(target);
      open();
    }
    // ukloni parametar da se popup ne otvara ponovo posle zatvaranja
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /** Stanovi grupisani po spratu, u redosledu prvog pojavljivanja. */
  const floors = useMemo(() => {
    const map = new Map<string, ApartmentRow[]>();
    for (const apt of apartments) {
      if (!map.has(apt.floor_name)) map.set(apt.floor_name, []);
      map.get(apt.floor_name)!.push(apt);
    }
    return Array.from(map.entries()).map(([title, apts]) => ({ title, apartments: apts }));
  }, [apartments]);

  // Zgrada postoji u bazi, ali stanovi još nisu uneti: prikaži statičku stranicu ako postoji
  if (state === 'missing' || (state === 'ready' && apartments.length === 0 && fallback)) {
    return fallback ?? <Navigate to="/properties" replace />;
  }

  if (state === 'loading' || !building) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-royal-ivory">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  const soon = building.status === 'Uskoro';

  return (
    <div className="relative min-h-screen bg-royal-ivory villa-page overflow-x-hidden">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* ===================== HERO ===================== */}
      <header className="relative flex min-h-[75vh] items-center">
        {heroVideo ? (
          <HeroVideo key={heroVideo.poster} videos={heroVideo.videos} poster={heroVideo.poster} />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${building.image_url ?? '/images/Rudjinci A1.webp'}")` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-black/20" />

        <div className="relative w-full">
          <div className="container-fluid px-6 md:px-10 lg:px-16">
            <div className="max-w-2xl">
              <span className={`eyebrow text-gold transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                {building.eyebrow ?? 'Projekat'}
              </span>
              <h1
                className={`heading mt-6 text-ts-h3 text-cream-100 transition-all delay-100 duration-1000 md:text-ts-h1 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
                style={{ fontFamily: 'Playfair Display' }}
              >
                <span className="block">Kralj Residence</span>
                <span className="block text-gold">{building.name}</span>
              </h1>
              {building.description && (
                <p className={`mt-6 max-w-xl text-ts-h6 font-light leading-relaxed text-cream-100/85 transition-all delay-200 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
                  {building.description}
                </p>
              )}
              <div className={`mt-10 flex flex-wrap items-center gap-4 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
                {apartments.length > 0 && (
                  <a href="#stanovi" className="btn-royal">Pogledaj stanove</a>
                )}
                <a href="tel:+381606112327" className="btn-royal-outline border-cream-100/40 text-cream-100 hover:bg-cream-100 hover:text-night">
                  <Phone className="h-4 w-4" />
                  {soon ? 'Pozovite za više informacija' : 'Pozovite nas'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {showScrollIndicator && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center text-cream-100/80">
            <span className="mb-2 text-xs uppercase tracking-[0.2em]">Skrolujte</span>
            <ChevronDown className="h-6 w-6 animate-bounce text-gold" />
          </div>
        )}
      </header>

      {/* ===================== FLOORS ===================== */}
      <div id="stanovi">
        {floors.map((floor, i) => (
          <FloorSection
            key={floor.title}
            title={floor.title}
            apartments={floor.apartments.map((a) => ({ id: a.id, number: a.number, size: a.size_label, type: a.type }))}
            tone={i % 2 === 1 ? 'sand' : 'light'}
            resolveCard={(apt) => {
              const row = floor.apartments.find((a) => a.id === apt.id)!;
              return {
                imageSrc: row.card_image_url ?? undefined,
                soldOverride: row.sold,
                outdoorLabel: row.outdoor_label,
                outdoorValue: row.outdoor_value ?? undefined,
                href: apartmentPages ? apartmentPath(slug, row.number) : undefined,
              };
            }}
            onSelectApartment={
              apartmentPages
                ? undefined
                : (apt) => {
                    const row = floor.apartments.find((a) => a.id === apt.id);
                    if (row) {
                      setSelected(row);
                      open();
                    }
                  }
            }
          />
        ))}
      </div>

      {/* ===================== KONTAKT ===================== */}
      <ContactSection
        title={`Zainteresovani za stan u objektu ${building.name}?`}
        onSuccess={() => setIsThankYouOpen(true)}
      />

      <Footer />

      {!apartmentPages && (
        <ApartmentModal
          isOpen={isOpen}
          onClose={() => {
            close();
            setSelected(null);
          }}
          objectName={building.name}
          outdoorLabel={selected?.outdoor_label}
          outdoorValue={selected?.outdoor_value ?? undefined}
          descriptionText={selected?.description ?? undefined}
          apartment={{
            ...SAMPLE_APARTMENT,
            name: selected ? `Stan broj ${selected.number} · ${selected.type}` : '',
            image: selected?.plan_image_url || selected?.card_image_url || SAMPLE_APARTMENT.image,
            size: selected?.size_label || SAMPLE_APARTMENT.size,
            number: selected?.number || 0,
            floor: selected?.floor_name || SAMPLE_APARTMENT.floor,
            status: selected ? (selected.sold ? 'Prodato' : 'Dostupno') : SAMPLE_APARTMENT.status,
          }}
        />
      )}

      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default BuildingPage;
