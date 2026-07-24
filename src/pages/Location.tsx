import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronDown, Phone, Mail, MapPin, Navigation as NavigationIcon, Clock } from 'lucide-react';
import NavigationBar from '../components/Navigation';
import ContactForm from '../components/ContactForm';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import { useScroll } from '../hooks/useScroll';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSeo } from '../hooks/useSeo';
import ThankYouModal from '../components/ThankYouModal';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RESORT_DISTANCES = [
  ['Centar', '520 m'],
  ['Dom zdravlja', '100 m'],
  ['Pijaca', '250 m'],
  ['Opština', '260 m'],
  ['Vrnjačke Terme', '370 m'],
];

const AQUA_DISTANCES = [
  ['Aqua Park', '560 m'],
  ['Osnovna škola', '100 m'],
  ['Market', '300 m'],
  ['Zamak kulture', '800 m'],
];

const FEATURES = [
  {
    icon: <NavigationIcon className="h-6 w-6" />,
    title: 'Centralna lokacija',
    description: 'U najekskluzivnijem delu Vrnjačke Banje, na par minuta hoda od centralnog parka i glavnih atrakcija.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Sve na dohvat ruke',
    description: 'Restorani, kafići, prodavnice, apoteke i medicinske ustanove nalaze se u neposrednoj blizini.',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Odlična povezanost',
    description: 'Lak pristup glavnim saobraćajnicama i dovoljno parking prostora za stanare i njihove goste.',
  },
];

const ATTRACTIONS = [
  { image: '/images/zamak kulture.webp', title: 'Zamak Belimarković', description: 'Poznat i kao Dvorac kulture, jedan od najznačajnijih kulturno-istorijskih spomenika Vrnjačke Banje, izgrađen 1888. godine u stilu italijanske renesanse.' },
  { image: '/images/most ljubavi.webp', title: 'Most Ljubavi', description: 'Jedan od najromantičnijih simbola Vrnjačke Banje. Prema legendi, parovi koji zaključaju katanac na mostu zauvek ostaju zajedno.' },
  { image: '/images/banjski park.webp', title: 'Banjski park', description: 'Živopisan prostor za druženje koji objedinjuje prirodu, kulturu i istoriju, pružajući mir među starim lipama i skulpturama.' },
  { image: '/images/promenada.webp', title: 'Promenada', description: 'Dugačka preko 2 km, centralno mesto svih susreta u Vrnjačkoj Banji sa udobnim mestima za predah i osveženje.' },
  { image: '/images/japanski vrt.webp', title: 'Japanski vrt', description: 'Mirno utočište sa kaskadnim vodopadima, drvenim mostićem i čajnom kućicom, spokojan ambijent za odmor u prirodi.' },
  { image: '/images/izvor_sneznik_vrnjacka_banja.webp', title: 'Izvor Snežnik', description: 'Jedan od najstarijih izvora mineralne vode u Vrnjačkoj Banji, poznat po lekovitoj vodi koja pomaže varenju i metabolizmu.' },
  { image: '/images/aqua-park-raj.webp', title: 'Aqua park', description: 'Moderan vodeni kompleks sa brojnim bazenima i toboganima, idealan za porodičnu zabavu tokom toplih letnjih dana.' },
];

const DistanceList = ({ title, items }: { title: string; items: string[][] }) => (
  <div>
    <h3 className="heading text-ts-h6 text-gold" style={{ fontFamily: 'Playfair Display' }}>
      {title}
    </h3>
    <ul className="mt-4 divide-y divide-gold/10">
      {items.map(([name, value]) => (
        <li key={name} className="flex items-center justify-between py-3 text-cream-100/85">
          <span className="flex items-center">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            {name}
          </span>
          <span className="font-sans text-sm tabular-nums text-gold">{value}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Location = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrolled, showScrollIndicator } = useScroll();
  useIntersectionObserver();
  useSeo({
    title: 'Lokacija stanova u Vrnjačkoj Banji | Kralj Residence',
    description:
      'Stanovi na najboljoj lokaciji u Vrnjačkoj Banji – u srcu banje, na koraku od centra, Aqua parka i svih sadržaja. Kralj Residence, novogradnja od investitora.',
    path: '/location',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-royal-ivory">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <NavigationBar scrolled={scrolled} />

      {/* ===================== HERO ===================== */}
      <header className="relative flex min-h-[70vh] items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/A6.webp")' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-black/20" />

        <div className="relative w-full">
          <div className="container-fluid px-6 md:px-10 lg:px-16">
            <div className="max-w-2xl">
              <span className={`eyebrow text-gold transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                Lokacija · Vrnjačka Banja
              </span>
              <h1
                className={`heading mt-6 text-ts-h2 text-cream-100 transition-all delay-100 duration-1000 md:text-ts-h1 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
                style={{ fontFamily: 'Playfair Display' }}
              >
                Stanovi u Vrnjačkoj Banji na najboljoj lokaciji
              </h1>
              <p className={`mt-6 max-w-xl text-ts-h6 font-light leading-relaxed text-cream-100/85 transition-all delay-200 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
                Novogradnja Kralj Residence nalazi se u najekskluzivnijem delu Vrnjačke Banje, okružena
                zelenilom i prirodnim lepotama, a opet na korak od svih gradskih sadržaja.
              </p>
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

      {/* ===================== MAPA + UDALJENOSTI ===================== */}
      <section className="section-light">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-24">
          <SectionHeading
            eyebrow="Udaljenosti"
            title="Sve na par minuta hoda"
            subtitle="Pregled udaljenosti Kralj Residence kompleksa od ključnih lokacija u Vrnjačkoj Banji."
          />

          <div className="mt-14 scroll-animate">
            <div className="overflow-hidden rounded-xl2 border border-royal-ink/10 shadow-royal">
              <img
                src="/images/MAPAA.webp"
                alt="Mapa lokacije Kralj Residence u Vrnjačkoj Banji"
                className="w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="card-royal-dark scroll-animate from-left p-8 md:p-10">
              <DistanceList title="Kralj Residence Resort" items={RESORT_DISTANCES} />
            </div>
            <div className="card-royal-dark scroll-animate from-right p-8 md:p-10">
              <DistanceList title="Kralj Residence Royal Aqua" items={AQUA_DISTANCES} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PREDNOSTI ===================== */}
      <section className="section-dark overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <SectionHeading eyebrow="Zašto ova lokacija" title="Prednosti života u Kralj Residence" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card-royal-dark scroll-animate from-bottom p-8"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  {f.icon}
                </div>
                <h3 className="heading mt-6 text-ts-h6 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
                  {f.title}
                </h3>
                <p className="mt-3 text-ts-p leading-relaxed text-cream-100/70">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ATRAKCIJE ===================== */}
      <section className="section-sand overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <SectionHeading
            eyebrow="Okruženje"
            title="U srcu Vrnjačke Banje"
            subtitle="Biser srpskog turizma na korak od vašeg doma. Najznačajnije atrakcije koje banju čine nezaboravnom."
          />
          <div className="mt-14">
            <Swiper
              modules={[SwiperNavigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop
              speed={800}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 } }}
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
                      <h3 className="heading absolute bottom-4 left-5 right-5 text-ts-h6 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
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

      {/* ===================== KONTAKT ===================== */}
      <section id="contact" className="section-dark overflow-hidden">
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
                  <ContactForm onSuccess={() => setIsModalOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default Location;
