import { useEffect, useState, useRef } from 'react';
import { ChevronDown, Phone, Mail, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContactForm from './components/ContactForm';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import CookieConsent from './components/CookieConsent';
import ThankYouModal from './components/ThankYouModal';
import SectionHeading from './components/SectionHeading';
import ProjectCard, { ProjectCardData } from './components/ProjectCard';
import FeaturedApartments from './components/FeaturedApartments';
import PanoramaSection from './components/PanoramaSection';
import { useScroll } from './hooks/useScroll';
import { useParallax } from './hooks/useParallax';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useSeo } from './hooks/useSeo';
import { isSupabaseConfigured } from './lib/supabase';
import { fetchVisibleBuildings, buildingPath, type Building as DbBuilding } from './lib/buildingsApi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BACKGROUND_IMAGES = ['/images/Rudjinci A1.webp'] as const;

const LOADING_DELAY = 900;

const RESORT_VILLAS: ProjectCardData[] = [
  {
    name: 'Vila I',
    image: '/images/A12.webp',
    size: '1200 m²',
    apartments: 23,
    features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
    status: 'Prodato',
  },
  {
    name: 'Vila II',
    image: '/images/A13.webp',
    size: '1200 m²',
    apartments: 23,
    features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
    status: 'Prodato',
  },
  {
    name: 'Vila III',
    image: '/images/A11.webp',
    size: '1500 m²',
    apartments: 27,
    features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
    status: 'Prodato',
  },
  {
    name: 'Vila IV',
    image: '/images/A15.webp',
    size: '1500 m²',
    apartments: 27,
    features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
    status: 'Dostupno',
    to: '/villa-4',
  },
];

const VILA5: ProjectCardData = {
  name: 'Vila V',
  image: '/images/vila-5.webp',
  size: '1400 m²',
  apartments: 30,
  features: ['Privatni bazen', 'Uređeno dvorište', 'Parking'],
  status: 'Uskoro',
};

const ROYAL_AQUA: ProjectCardData = {
  name: 'Royal Aqua',
  image: '/images/Rudjinci A2.webp',
  size: '1500 m²',
  apartments: 27,
  features: ['Privatni bazen', 'Uređeno dvorište', 'Ekskluzivna lokacija'],
  status: 'Dostupno',
  to: '/royal-aqua',
};

const ATTRACTIONS = [
  { image: '/images/zamak kulture.webp', title: 'Zamak Belimarković', description: 'Poznat i kao Dvorac kulture, jedan od najznačajnijih kulturno-istorijskih spomenika Vrnjačke Banje, izgrađen 1888. godine u stilu italijanske renesanse.' },
  { image: '/images/most ljubavi.webp', title: 'Most Ljubavi', description: 'Jedan od najromantičnijih simbola Vrnjačke Banje. Prema legendi, parovi koji zaključaju katanac na mostu zauvek ostaju zajedno.' },
  { image: '/images/banjski park.webp', title: 'Banjski park', description: 'Živopisan prostor za druženje koji objedinjuje prirodu, kulturu i istoriju, pružajući mir među starim lipama i skulpturama.' },
  { image: '/images/promenada.webp', title: 'Promenada', description: 'Dugačka preko 2 km, centralno mesto svih susreta u Vrnjačkoj Banji sa udobnim mestima za predah i osveženje.' },
  { image: '/images/japanski vrt.webp', title: 'Japanski vrt', description: 'Mirno utočište sa kaskadnim vodopadima, drvenim mostićem i čajnom kućicom — spokojan ambijent za odmor u prirodi.' },
  { image: '/images/izvor_sneznik_vrnjacka_banja.webp', title: 'Izvor Snežnik', description: 'Jedan od najstarijih izvora mineralne vode u Vrnjačkoj Banji, poznat po lekovitoj vodi koja pomaže varenju i metabolizmu.' },
  { image: '/images/aqua-park-raj.webp', title: 'Aqua park', description: 'Moderan vodeni kompleks sa brojnim bazenima i toboganima, idealan za porodičnu zabavu tokom toplih letnjih dana.' },
];

/**
 * Velika sekcija zgrade na početnoj (admin tab „Početna strana").
 * Pozadine se smenjuju bela → braon → bež, a kartica menja stranu.
 */
const HOME_TONES = ['light', 'dark', 'sand'] as const;

const HomeBuildingSection = ({ building, index }: { building: DbBuilding; index: number }) => {
  const tone = HOME_TONES[index % HOME_TONES.length];
  const isDark = tone === 'dark';
  const cardLeft = index % 2 === 0;
  const available = building.status === 'Dostupno';
  const soon = building.status === 'Uskoro';
  const path = buildingPath(building.slug);

  const card: ProjectCardData = {
    name: building.name,
    image: building.image_url ?? '',
    size: building.size_label ?? '—',
    apartments: building.total_apartments ?? 0,
    features: building.features,
    status: building.status,
    to: available ? path : undefined,
  };

  const sectionClass =
    tone === 'light' ? 'section-light' : tone === 'sand' ? 'section-sand' : 'section-dark overflow-hidden';

  return (
    <section className={sectionClass}>
      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Kartica */}
          <div
            className={
              cardLeft
                ? 'scroll-animate from-left order-1'
                : 'scroll-animate from-right order-1 w-full max-w-md justify-self-center lg:order-2 lg:justify-self-end'
            }
          >
            <ProjectCard
              data={card}
              variant={isDark ? 'dark' : 'light'}
              className={!isDark && soon ? 'bg-royal-sand border-gold/30' : ''}
            />
          </div>

          {/* Tekst */}
          <div className={cardLeft ? 'scroll-animate from-right order-2' : 'scroll-animate from-left order-2 lg:order-1'}>
            <SectionHeading
              align="left"
              eyebrow={building.eyebrow || 'Kralj Residence'}
              title={building.home_title || building.name}
              subtitle={building.description ?? undefined}
            />

            {building.features.length > 0 && (
              <ul className={`mt-8 grid grid-cols-2 gap-4 ${isDark ? 'text-cream-100/80' : 'text-royal-stone'}`}>
                {building.features.map((f) => (
                  <li key={f} className="flex items-center text-ts-p">
                    <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {available ? (
              <div className="mt-10 hidden flex-wrap gap-4 md:flex">
                <Link to={path} className="btn-royal">
                  Ponuda stanova
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#contact" className="btn-royal-outline">Kontakt</a>
              </div>
            ) : soon ? (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="tel:+381606112327" className="btn-royal-outline">
                  <Phone className="h-4 w-4" />
                  Pozovite za više informacija
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

/** Spaja statičke podatke kartice sa stanjem iz baze (status, slika, link). */
const mergeWithDb = (staticData: ProjectCardData, row?: DbBuilding): ProjectCardData => {
  if (!row) return staticData;
  return {
    ...staticData,
    name: row.name,
    image: row.image_url ?? staticData.image,
    size: row.size_label ?? staticData.size,
    apartments: row.total_apartments ?? staticData.apartments,
    features: row.features.length ? row.features : staticData.features,
    status: row.status,
    to: row.status === 'Dostupno' ? buildingPath(row.slug) : undefined,
  };
};

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const currentImageIndex = 0;
  const [, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbBuildings, setDbBuildings] = useState<Record<string, DbBuilding>>({});
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const { scrolled, showScrollIndicator, scrollPosition } = useScroll();
  const { calculateScale, calculateTextOpacity, calculateTextTransform } = useParallax(scrollPosition);
  useIntersectionObserver();
  useSeo({
    title: 'Prodaja stanova Vrnjačka Banja | Kralj Residence – Novogradnja od investitora',
    description:
      'Direktna prodaja stanova u Vrnjačkoj Banji od investitora. Novogradnja, luksuzni apartmani i vile u srcu banje – Kralj Residence. Pozovite 060 611 2327.',
    path: '/',
  });

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), LOADING_DELAY);
    return () => clearTimeout(visibilityTimer);
  }, []);

  // Statusi zgrada iz baze (admin panel) — statički podaci ostaju fallback
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchVisibleBuildings()
      .then((rows) => setDbBuildings(Object.fromEntries(rows.map((r) => [r.slug, r]))))
      .catch(() => undefined);
  }, []);

  const vila5 = mergeWithDb(VILA5, dbBuildings['vila-5']);
  const royalAqua = mergeWithDb(ROYAL_AQUA, dbBuildings['royal-aqua']);
  const resortVillas = [
    mergeWithDb(RESORT_VILLAS[0], dbBuildings['vila-1']),
    mergeWithDb(RESORT_VILLAS[1], dbBuildings['vila-2']),
    mergeWithDb(RESORT_VILLAS[2], dbBuildings['villa-3']),
    mergeWithDb(RESORT_VILLAS[3], dbBuildings['villa-4']),
  ];
  const vila5Available = vila5.status === 'Dostupno';

  // Zgrade koje admin uključi na početnu (tab „Početna strana"); statički fallback dok baza nije spremna
  const homeBuildings = Object.values(dbBuildings)
    .filter((b) => b.featured_home)
    .sort((a, b) => a.home_sort - b.home_sort);

  return (
    <div className="relative min-h-screen">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <BackgroundSlideshow
        images={[...BACKGROUND_IMAGES]}
        currentIndex={currentImageIndex}
        calculateScale={calculateScale}
      />

      <div className="relative z-10">
        <Navigation scrolled={scrolled} />

        {/* ===================== HERO ===================== */}
        <header className="relative flex min-h-screen items-center">
          {/* Scrim for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

          <div
            className="relative w-full"
            style={{
              opacity: calculateTextOpacity(),
              transform: calculateTextTransform(),
              transition: 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 1s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="container-fluid px-6 md:px-10 lg:px-16">
              <div className="max-w-2xl">
                <span
                  className={`eyebrow text-gold transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                  <span className="whitespace-nowrap">
                    Vrnjačka Banja<span className="hidden sm:inline"> · Direktno od investitora</span>
                  </span>
                </span>

                <h1
                  className={`heading mt-6 text-ts-h2 text-cream-100 transition-all duration-1000 delay-100 md:text-[4.5rem] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Kralj Residence
                </h1>

                <p
                  className={`mt-6 max-w-xl text-ts-h6 font-light leading-relaxed text-cream-100/85 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
                >
                  Novogradnja i direktna prodaja stanova u najlepšem delu Vrnjačke Banje.
                  Tu se kraljevski luksuz susreće sa prirodom.
                </p>

                <div
                  className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
                >
                  <Link to="/properties" className="btn-royal">
                    Pogledaj projekte
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#contact"
                    className="btn-royal-outline border-cream-100 bg-cream-100 text-night hover:border-white hover:bg-white hover:text-night"
                  >
                    Zakaži razgledanje
                  </a>
                </div>

                <div
                  className={`mt-12 flex flex-wrap gap-x-10 gap-y-4 text-cream-100/80 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
                >
                  {[
                    ['30+', 'godina iskustva'],
                    ['200+', 'stambenih jedinica'],
                    ['10+', 'luksuznih objekata', true],
                  ].map(([value, label, hideMobile]) => (
                    <div key={label as string} className={hideMobile ? 'hidden sm:block' : ''}>
                      <div className="heading text-ts-h4 text-gold" style={{ fontFamily: 'Playfair Display' }}>
                        {value}
                      </div>
                      <div className="text-sm uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
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

        {/* ===================== ZGRADE NA POČETNOJ (iz admin panela) ===================== */}
        {homeBuildings.length > 0 ? (
          homeBuildings.map((b, i) => <HomeBuildingSection key={b.id} building={b} index={i} />)
        ) : (
          <>
        {/* ===================== VILA V (novo, light) ===================== */}
        <section className="section-light">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Card LEFT */}
              <div className="scroll-animate from-left order-1">
                <ProjectCard data={vila5} className="bg-royal-sand border-gold/30" />
              </div>

              {/* Text RIGHT */}
              <div className="scroll-animate from-right order-2">
                <SectionHeading
                  align="left"
                  eyebrow="Kralj Residence Resort"
                  title="Novogradnja stanova u Vrnjačkoj Banji"
                />
                <p className="mt-6 text-ts-p leading-relaxed text-royal-stone">
                  Vila V je nastavak projekta Kralj Residence Resort, novogradnja u Vrnjačkoj Banji sa
                  još jednim uređenim dvorištem i sopstvenim bazenom. Nastavljamo da gradimo luksuzne
                  stanove za prodaju u srcu banje, sa istim kvalitetom i posvećenošću po kojima smo
                  prepoznatljivi.
                </p>
                <p className="mt-4 text-ts-p leading-relaxed text-royal-stone">
                  Direktna prodaja od investitora, savremen dizajn i mirna lokacija okružena zelenilom.
                  {!vila5Available && ' Broj stanova i cene biće dostupni uskoro.'}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  {vila5Available && vila5.to && (
                    <Link to={vila5.to} className="btn-royal">
                      Ponuda stanova
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <a href="tel:+381606112327" className="btn-royal-outline">
                    <Phone className="h-4 w-4" />
                    Pozovite za više informacija
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== ROYAL AQUA (dark) ===================== */}
        <section className="section-dark overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(45deg,#C9A24A 1px,transparent 1px),linear-gradient(-45deg,#C9A24A 1px,transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="scroll-animate from-left">
                <SectionHeading
                  align="left"
                  eyebrow="Royal Aqua"
                  title="Novi stanovi u Vrnjačkoj Banji uz Aqua park"
                  subtitle="27 ekskluzivnih stanova sa privatnim bazenom i uređenim dvorištem, na koraku od Aqua parka i centra Vrnjačke Banje."
                />
                <ul className="mt-8 grid grid-cols-2 gap-4 text-cream-100/80">
                  {['Privatni bazen', 'Parking mesta', 'Uređeno dvorište', 'Ekskluzivna lokacija'].map((f) => (
                    <li key={f} className="flex items-center text-ts-p">
                      <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 hidden flex-wrap gap-4 md:flex">
                  <Link to="/royal-aqua" className="btn-royal">
                    Ponuda stanova
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#contact" className="btn-royal-outline">Kontakt</a>
                </div>
              </div>

              <div className="scroll-animate from-right w-full max-w-md justify-self-center lg:justify-self-end">
                <ProjectCard data={royalAqua} variant="dark" />
              </div>
            </div>
          </div>
        </section>
          </>
        )}

        {/* ===================== IZDVAJAMO IZ PONUDE ===================== */}
        <FeaturedApartments />

        {/* ===================== RESORT (Vile I–IV, light) ===================== */}
        <section className="section-sand">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <SectionHeading
              eyebrow="Kralj Residence Resort"
              title="Stanovi u srcu Vrnjačke Banje"
              subtitle="Četiri elegantne vile sa privatnim bazenima i sadržajima za porodični život."
            />

            <div className="mt-14 flex flex-col-reverse gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {resortVillas.map((villa, i) => (
                <div
                  key={villa.name}
                  className="scroll-animate from-bottom"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <ProjectCard data={villa} compact />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 360° VIRTUELNI OBILAZAK ===================== */}
        <PanoramaSection />

        {/* ===================== O NAMA (light) ===================== */}
        <section id="about" ref={aboutSectionRef} className="section-light">
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
            <SectionHeading
              eyebrow="O nama"
              title={<>Tri decenije poverenja u<br />Vrnjačkoj Banji</>}
            />

            <div className="mt-16 grid items-center gap-14 lg:grid-cols-12">
              <div className="scroll-animate from-left relative lg:col-span-7">
                <div className="overflow-hidden rounded-xl2 shadow-royal">
                  <img
                    src="/images/hotel kralj slika.webp"
                    alt="Kralj Residence — kompleks u Vrnjačkoj Banji"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pointer-events-none absolute -bottom-5 -right-5 hidden h-24 w-24 rounded-tl-xl2 border-b-2 border-r-2 border-gold/50 md:block" />
              </div>

              <div className="scroll-animate from-right lg:col-span-5">
                <h3 className="heading text-ts-h4 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                  Kralj Residence
                </h3>
                <div className="mt-3 h-px w-16 bg-gold" />
                <p className="mt-6 text-ts-p leading-relaxed text-royal-stone">
                  Kralj Residence je porodična firma porodice Zekanović, koja već decenijama gradi
                  poverenje u Vrnjačkoj Banji. Iza nas stoji Hotel Kralj, prisutan od 2008. godine,
                  i dugogodišnje iskustvo u ugostiteljstvu, turizmu i gradnji nekretnina.
                </p>
                <p className="mt-4 text-ts-p leading-relaxed text-royal-stone">
                  Danas smo jedan od vodećih investitora novogradnje u Vrnjačkoj Banji. Nudimo
                  direktnu prodaju stanova od investitora, bez posrednika i provizije, uz vrhunski
                  kvalitet gradnje, savremen dizajn i lokacije u samom srcu banje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FILLER / CTA (braon) ===================== */}
        <section className="relative overflow-hidden bg-royal-espresso text-cream-100">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="scroll-animate from-left lg:col-span-8">
                <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
                  Tu smo za vas
                </span>
                <h2
                  className="heading mt-4 text-ts-h4 md:text-ts-h3"
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Otvoreni smo za sva vaša pitanja
                </h2>
                <p className="mt-5 max-w-2xl text-ts-p leading-relaxed text-cream-100/75">
                  Bilo da vas zanima kupovina stana u nekom od naših završenih projekata, dostupnost i
                  cene u Vili IV i Royal Aqua kompleksu, ili detalji o novoj Vili V koja je uskoro u
                  ponudi, tu smo da vam pomognemo. Naš tim vam rado izlazi u susret sa svim informacijama
                  o novogradnji u Vrnjačkoj Banji, uslovima kupovine i mogućnostima plaćanja. Pozovite nas
                  ili nam pišite, odgovaramo brzo i bez ikakve obaveze.
                </p>
              </div>

              <div className="scroll-animate from-right flex lg:col-span-4 lg:justify-end">
                <button
                  type="button"
                  className="btn-royal-outline border-gold/40 text-gold hover:border-gold hover:bg-gold hover:text-night"
                >
                  O projektu
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== PARALLAX ===================== */}
        <div className="relative h-[45vh] overflow-hidden bg-night">
          <div
            className="absolute inset-0 hidden bg-cover bg-center md:block"
            style={{ backgroundImage: 'url("/images/Stan 17 S1.webp")', filter: 'brightness(0.55)', backgroundAttachment: 'fixed' }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: 'url("/images/Stan 17 S1.webp")', filter: 'brightness(0.55)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="scroll-animate">
              <p className="heading text-ts-h4 text-cream-100 md:text-ts-h3" style={{ fontFamily: 'Playfair Display' }}>
                Novogradnja u Vrnjačkoj Banji koja je više od mesta za život.
              </p>
              <a href="#contact" className="btn-royal mt-8">Kontaktirajte nas</a>
            </div>
          </div>
        </div>

        {/* ===================== ATRAKCIJE (light) ===================== */}
        <section className="section-sand overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
            <SectionHeading
              eyebrow="Okruženje"
              title="U srcu Vrnjačke Banje"
              subtitle="Biser srpskog turizma na korak od vašeg doma. Najznačajnije atrakcije koje banju čine nezaboravnom."
            />

            <div className="mt-16">
              <Swiper
                modules={[SwiperNavigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop
                speed={800}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="attractions-swiper"
              >
                {ATTRACTIONS.map((a) => (
                  <SwiperSlide key={a.title} className="group h-auto">
                    <article className="card-royal h-full">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={a.image}
                          alt={`${a.title} — Vrnjačka Banja`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <h3
                          className="heading absolute bottom-4 left-5 right-5 text-ts-h6 text-cream-100"
                          style={{ fontFamily: 'Playfair Display' }}
                        >
                          {a.title}
                        </h3>
                      </div>
                      <div className="p-6">
                        <p className="text-ts-p leading-relaxed text-royal-stone">{a.description}</p>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* ===================== KONTAKT (dark) ===================== */}
        <section id="contact" className="section-dark overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(45deg,#C9A24A 1px,transparent 1px),linear-gradient(-45deg,#C9A24A 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              {/* LEFT — info */}
              <div className="scroll-animate from-left">
                <SectionHeading
                  align="left"
                  eyebrow="Kontakt"
                  title="Razgovarajmo o vašem novom domu"
                  subtitle="Zainteresovani ste za stan u Vrnjačkoj Banji? Pišite nam ili pozovite, odgovaramo brzo i bez ikakve obaveze."
                />

                <div className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
                  {[
                    { icon: <Phone className="h-5 w-5" />, label: 'Telefon', value: '+381 60 611 2327', href: 'tel:+381606112327' },
                    { icon: <Phone className="h-5 w-5" />, label: 'Telefon', value: '+381 60 611 2328', href: 'tel:+381606112328' },
                    { icon: <Mail className="h-5 w-5" />, label: 'Email', value: 'office@kraljresidence.rs', href: 'mailto:office@kraljresidence.rs' },
                    { icon: <MapPin className="h-5 w-5" />, label: 'Adresa', value: 'Kneza Miloša 6, Vrnjačka Banja' },
                    { icon: <Clock className="h-5 w-5" />, label: 'Radno vreme', value: 'Ponedeljak – Nedelja, 09:00 – 20:00' },
                  ].map((row, i) =>
                    row.href ? (
                      <a key={i} href={row.href} className="group flex items-center gap-4 py-4">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-night">
                          {row.icon}
                        </span>
                        <span>
                          <span className="block text-xs uppercase tracking-[0.16em] text-gold">{row.label}</span>
                          <span className="block text-ts-h6 text-cream-100 transition-colors group-hover:text-gold">{row.value}</span>
                        </span>
                      </a>
                    ) : (
                      <div key={i} className="flex items-center gap-4 py-4">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                          {row.icon}
                        </span>
                        <span>
                          <span className="block text-xs uppercase tracking-[0.16em] text-gold">{row.label}</span>
                          <span className="block text-ts-h6 text-cream-100">{row.value}</span>
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* RIGHT — form */}
              <div className="scroll-animate from-right">
                <div className="rounded-xl2 border border-gold/15 bg-royal-espresso p-7 shadow-royal md:p-10">
                  <h3 className="heading text-ts-h5 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
                    Pošaljite upit
                  </h3>
                  <p className="mt-2 text-ts-p text-cream-100/60">
                    Popunite formu i javljamo vam se sa svim detaljima.
                  </p>
                  <div className="mt-7">
                    <ContactForm onSuccess={() => setIsModalOpen(true)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <CookieConsent />
        <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} autoCloseDelay={2000} />
      </div>
    </div>
  );
}

export default App;
