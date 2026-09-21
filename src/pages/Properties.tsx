import { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ThankYouModal from '../components/ThankYouModal';
import SectionHeading from '../components/SectionHeading';
import ProjectCard, { ProjectCardData } from '../components/ProjectCard';
import { useScroll } from '../hooks/useScroll';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSeo } from '../hooks/useSeo';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchVisibleBuildings, buildingPath } from '../lib/buildingsApi';

interface Building {
  eyebrow: string;
  title: string;
  description: string;
  card: ProjectCardData;
  variant?: 'light' | 'dark';
  cardClassName?: string;
}

const BUILDINGS: Building[] = [
  {
    eyebrow: 'Novo · Počela prodaja',
    title: 'Vila V',
    description:
      'Nastavak projekta Kralj Residence Resort. Novo uređeno dvorište, sopstveni bazen i 30 luksuznih stanova. Prodaja je počela, direktno od investitora.',
    card: {
      name: 'Vila V',
      image: '/images/vila-5.webp',
      size: '1400 m²',
      apartments: 30,
      features: ['Privatni bazen', 'Uređeno dvorište', 'Parking'],
      status: 'Dostupno',
      to: '/vila-5',
    },
    cardClassName: 'bg-royal-sand border-gold/30',
  },
  {
    eyebrow: 'U prodaji',
    title: 'Royal Aqua',
    description:
      'Ekskluzivni stambeni kompleks sa privatnim bazenom, uređenim dvorištem i parkingom. 27 stanova na koraku od Aqua parka i centra Vrnjačke Banje.',
    card: {
      name: 'Royal Aqua',
      image: '/images/Rudjinci A2.webp',
      size: '1500 m²',
      apartments: 27,
      features: ['Privatni bazen', 'Uređeno dvorište', 'Ekskluzivna lokacija'],
      status: 'Dostupno',
      to: '/royal-aqua',
    },
    variant: 'dark',
  },
  {
    eyebrow: 'U prodaji',
    title: 'Vila IV',
    description:
      'Poslednji dostupni stanovi u Kralj Residence Resort kompleksu. Privatni bazen, igralište za decu i paviljon za roštilj u mirnom okruženju.',
    card: {
      name: 'Vila IV',
      image: '/images/A15.webp',
      size: '1500 m²',
      apartments: 27,
      features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
      status: 'Dostupno',
      to: '/villa-4',
    },
  },
  {
    eyebrow: 'Rasprodato',
    title: 'Vila III',
    description: 'Deo Kralj Residence Resort kompleksa. Svi stanovi su prodati.',
    card: {
      name: 'Vila III',
      image: '/images/A11.webp',
      size: '1500 m²',
      apartments: 27,
      features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
      status: 'Prodato',
    },
  },
  {
    eyebrow: 'Rasprodato',
    title: 'Vila II',
    description: 'Deo prve faze Kralj Residence Resort projekta. Svi stanovi su prodati.',
    card: {
      name: 'Vila II',
      image: '/images/A13.webp',
      size: '1200 m²',
      apartments: 23,
      features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
      status: 'Prodato',
    },
  },
  {
    eyebrow: 'Rasprodato',
    title: 'Vila I',
    description: 'Prva vila u Kralj Residence Resort kompleksu. Svi stanovi su prodati.',
    card: {
      name: 'Vila I',
      image: '/images/A12.webp',
      size: '1200 m²',
      apartments: 23,
      features: ['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'],
      status: 'Prodato',
    },
  },
];

const Properties = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setIsLoading] = useState(true);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS);
  const { scrolled, showScrollIndicator } = useScroll();
  useIntersectionObserver();

  // Zgrade iz Supabase baze; statička lista ostaje kao fallback
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    fetchVisibleBuildings()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setBuildings(
          rows.map((b) => ({
            eyebrow: b.eyebrow ?? (b.status === 'Prodato' ? 'Rasprodato' : b.status === 'Uskoro' ? 'Uskoro u ponudi' : 'U prodaji'),
            title: b.name,
            description: b.description ?? '',
            card: {
              name: b.name,
              image: b.image_url ?? '/images/Rudjinci A1.webp',
              size: b.size_label ?? '',
              apartments: b.total_apartments ?? 0,
              features: b.features,
              status: b.status,
              to: b.status !== 'Prodato' ? buildingPath(b.slug) : undefined,
            },
            cardClassName: b.status === 'Uskoro' ? 'bg-royal-sand border-gold/30' : undefined,
          }))
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  useSeo({
    title: 'Stanovi za prodaju u Vrnjačkoj Banji | Kralj Residence',
    description:
      'Kompletna ponuda novogradnje: stanovi i apartmani za prodaju u Vrnjačkoj Banji. Vila V, Royal Aqua i Vila IV – direktna prodaja od investitora.',
    path: '/properties',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-royal-ivory">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* ===================== HERO ===================== */}
      <header className="relative flex min-h-[85vh] items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/Rudjinci A1.webp")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-black/20" />

        <div className="relative w-full">
          <div className="container-fluid px-6 md:px-10 lg:px-16">
            <div className="max-w-2xl">
              <span
                className={`eyebrow text-gold transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
              >
                Naši projekti · Vrnjačka Banja
              </span>
              <h1
                className={`heading mt-6 text-ts-h2 text-cream-100 transition-all delay-100 duration-1000 md:text-ts-h1 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
                style={{ fontFamily: 'Playfair Display' }}
              >
                Naše nekretnine
              </h1>
              <p
                className={`mt-6 max-w-xl text-ts-h6 font-light leading-relaxed text-cream-100/85 transition-all delay-200 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
              >
                Svi projekti Kralj Residence na jednom mestu. Novogradnja, luksuzni stanovi i vile u
                srcu Vrnjačke Banje, direktno od investitora.
              </p>
              <a
                href="#projekti"
                className={`btn-royal mt-10 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
              >
                Pogledaj sve zgrade
                <ArrowRight className="h-4 w-4" />
              </a>
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

      {/* ===================== INTRO ===================== */}
      <section id="projekti" className="section-light">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <SectionHeading
            eyebrow="Hronološki pregled"
            title="Aktuelni projekti u Vrnjačkoj Banji"
            subtitle="Od najnovije Vile V, preko Royal Aqua kompleksa, do prvih vila u okviru Kralj Residence Resort projekta."
          />
        </div>
      </section>

      {/* ===================== BUILDINGS ===================== */}
      {buildings.map((b, i) => {
        const reversed = i % 2 === 1;
        const soon = b.card.status === 'Uskoro';
        const sold = b.card.status === 'Prodato';
        return (
          <section key={b.title} className={reversed ? 'section-dark overflow-hidden' : 'section-sand'}>
            <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12 md:py-16">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Card */}
                <div className={`scroll-animate ${reversed ? 'from-right lg:order-2' : 'from-left lg:order-1'}`}>
                  <ProjectCard data={b.card} variant={b.variant ?? (reversed ? 'dark' : 'light')} className={b.cardClassName} />
                </div>

                {/* Text */}
                <div className={`scroll-animate ${reversed ? 'from-left lg:order-1' : 'from-right lg:order-2'}`}>
                  <span
                    className={`inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] ${
                      reversed ? 'text-gold' : 'text-gold-deep'
                    }`}
                  >
                    {b.eyebrow}
                  </span>
                  <h2
                    className={`heading mt-4 text-ts-h3 md:text-ts-h2 ${reversed ? 'text-cream-100' : 'text-royal-ink'}`}
                    style={{ fontFamily: 'Playfair Display' }}
                  >
                    {b.title}
                  </h2>
                  <div className="mt-4 h-px w-16 bg-gold" />
                  <p className={`mt-6 max-w-xl text-ts-p leading-relaxed ${reversed ? 'text-cream-100/75' : 'text-royal-stone'}`}>
                    {b.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {soon ? (
                      <>
                        {b.card.to && (
                          <Link to={b.card.to} className="btn-royal">
                            Pogledaj stanove
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                        <a
                          href="tel:+381606112327"
                          className={
                            !b.card.to
                              ? 'btn-royal'
                              : reversed
                              ? 'btn-royal-outline border-cream-100/40 text-cream-100 hover:bg-cream-100 hover:text-night'
                              : 'btn-royal-outline'
                          }
                        >
                          <Phone className="h-4 w-4" />
                          Pozovite za informacije
                        </a>
                      </>
                    ) : sold ? (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-royal-stone/70">
                        Rasprodato
                      </span>
                    ) : (
                      <Link to={b.card.to ?? '#'} className="btn-royal">
                        Pogledaj stanove
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ===================== FILLER / CTA (braon) ===================== */}
      <section className="relative overflow-hidden bg-royal-espresso text-cream-100">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="scroll-animate from-left lg:col-span-8">
              <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
                Niste sigurni šta odgovara vama?
              </span>
              <h2 className="heading mt-4 text-ts-h4 md:text-ts-h3" style={{ fontFamily: 'Playfair Display' }}>
                Pomoći ćemo vam da izaberete pravi stan
              </h2>
              <p className="mt-5 max-w-2xl text-ts-p leading-relaxed text-cream-100/75">
                Naš tim vam stoji na raspolaganju za sve informacije o dostupnim stanovima, cenama,
                uslovima kupovine i mogućnostima plaćanja. Kontaktirajte nas i pronaći ćemo rešenje po
                vašoj meri, bez ikakve obaveze.
              </p>
            </div>
            <div className="scroll-animate from-right flex lg:col-span-4 lg:justify-end">
              <a href="#contact" className="btn-royal-outline border-gold/40 text-gold hover:border-gold hover:bg-gold hover:text-night">
                <Clock className="h-4 w-4" />
                Zakažite razgovor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== KONTAKT ===================== */}
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

            <div className="scroll-animate from-right">
              <div className="rounded-xl2 border border-gold/15 bg-royal-espresso p-7 shadow-royal md:p-10">
                <h3 className="heading text-ts-h5 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
                  Pošaljite upit
                </h3>
                <p className="mt-2 text-ts-p text-cream-100/60">Popunite formu i javljamo vam se sa svim detaljima.</p>
                <div className="mt-7">
                  <ContactForm onSuccess={() => setIsThankYouOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default Properties;
