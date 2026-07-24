import { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ANIMATION_DELAYS, SAMPLE_APARTMENT } from '../constants';
import { apartmentStatusForPath } from '../constants/apartmentAvailability';
import ContactForm from '../components/ContactForm';
import {
  ROYAL_AQUA_GROUND_FLOOR_APARTMENTS,
  ROYAL_AQUA_FIRST_FLOOR_APARTMENTS,
  ROYAL_AQUA_SECOND_FLOOR_APARTMENTS,
  ROYAL_AQUA_THIRD_FLOOR_APARTMENTS,
  ROYAL_AQUA_PENTHOUSE_APARTMENTS,
  getFloorName,
} from '../constants/royalAquaApartments';
import { useModal } from '../hooks/useModal';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ApartmentModal from '../components/ApartmentModal';
import FloorSection from '../components/FloorSection';
import SectionHeading from '../components/SectionHeading';
import ThankYouModal from '../components/ThankYouModal';
import { useScroll } from '../hooks/useScroll';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSeo } from '../hooks/useSeo';

const FLOORS = [
  { title: 'Nisko Prizemlje', apartments: ROYAL_AQUA_GROUND_FLOOR_APARTMENTS },
  { title: 'Visoko Prizemlje', apartments: ROYAL_AQUA_FIRST_FLOOR_APARTMENTS },
  { title: 'Prvi Sprat', apartments: ROYAL_AQUA_SECOND_FLOOR_APARTMENTS },
  { title: 'Drugi Sprat', apartments: ROYAL_AQUA_THIRD_FLOOR_APARTMENTS },
  { title: 'Povučeni Sprat', apartments: ROYAL_AQUA_PENTHOUSE_APARTMENTS },
];

const royalImage = (n: number) => {
  const map: Record<number, string> = {
    1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11',
    12: '5', 13: '6', 14: '7', 15: '8', 16: '9', 17: '10', 18: '11', 19: '5', 20: '6', 21: '7',
    22: '8', 23: '9', 24: '10', 25: '11', 26: '26', 27: '27',
  };
  return `/images/royal/stan ${map[n] ?? '27'}.webp`;
};

const RoyalAquaApartments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setIsLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<null | { id: number; number: number; size: number; type?: string }>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const { isOpen, open, close } = useModal();
  const { scrolled, showScrollIndicator } = useScroll();
  useIntersectionObserver();
  useSeo({
    title: 'Royal Aqua – prodaja stanova Vrnjačka Banja | Kralj Residence',
    description:
      'Novi stanovi za prodaju u Royal Aqua kompleksu, Vrnjačka Banja. Privatni bazen, uređeno dvorište i lokacija uz Aqua park. Direktna prodaja od investitora.',
    path: '/royal-aqua',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), ANIMATION_DELAYS.LOADING);
    return () => clearTimeout(timer);
  }, []);

  const apartment = SAMPLE_APARTMENT;

  return (
    <div className="relative min-h-screen bg-royal-ivory villa-page overflow-x-hidden">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* ===================== HERO ===================== */}
      <header className="relative flex min-h-[75vh] items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/Rudjinci A2.webp")' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-black/20" />

        <div className="relative w-full">
          <div className="container-fluid px-6 md:px-10 lg:px-16">
            <div className="max-w-2xl">
              <span className={`eyebrow text-gold transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                Projekat · U prodaji
              </span>
              <h1
                className={`heading mt-6 text-ts-h3 text-cream-100 transition-all delay-100 duration-1000 md:text-ts-h1 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
                style={{ fontFamily: 'Playfair Display' }}
              >
                <span className="block">Kralj Residence</span>
                <span className="block text-gold">Royal Aqua</span>
              </h1>
              <p className={`mt-6 max-w-xl text-ts-h6 font-light leading-relaxed text-cream-100/85 transition-all delay-200 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
                Ekskluzivna ponuda stanova u Royal Aqua kompleksu. Svaka jedinica je pažljivo
                dizajnirana da pruži savršen spoj luksuza, udobnosti i funkcionalnosti.
              </p>
              <a href="#stanovi" className={`btn-royal mt-10 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
                Pogledaj stanove
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

      {/* ===================== FLOORS ===================== */}
      <div id="stanovi">
        {FLOORS.map((floor, i) => (
          <FloorSection
            key={floor.title}
            title={floor.title}
            apartments={floor.apartments}
            tone={i % 2 === 1 ? 'sand' : 'light'}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
        ))}
      </div>

      {/* ===================== KONTAKT ===================== */}
      <section id="contact" className="section-dark overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="scroll-animate from-left">
              <SectionHeading
                align="left"
                eyebrow="Kontakt"
                title="Zainteresovani za stan u Royal Aqua?"
                subtitle="Pošaljite poruku ili pozovite, naš tim vam se javlja u najkraćem roku, bez ikakve obaveze."
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

      <ApartmentModal
        isOpen={isOpen}
        onClose={() => {
          close();
          setSelectedApartment(null);
        }}
        apartment={{
          ...apartment,
          name: selectedApartment ? `Stan broj ${selectedApartment.number} · ${selectedApartment.type ?? ''}` : '',
          image: selectedApartment ? royalImage(selectedApartment.number) : apartment.image,
          size: selectedApartment?.size || apartment.size,
          number: selectedApartment?.number || 0,
          floor: selectedApartment ? getFloorName(selectedApartment.number) : apartment.floor,
          status: selectedApartment ? apartmentStatusForPath('/royal-aqua', selectedApartment.number) : apartment.status,
        }}
      />

      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default RoyalAquaApartments;
