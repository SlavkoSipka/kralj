import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronDown, Phone, Mail, MapPin, Navigation as NavigationIcon, Clock } from 'lucide-react';
import NavigationBar from '../components/Navigation';
import ContactForm from '../components/ContactForm';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import { useScroll } from '../hooks/useScroll';
import { useParallax } from '../hooks/useParallax';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ThankYouModal from '../components/ThankYouModal'; // Uvezi ThankYouModal

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Location = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Dodato stanje za modal
  const { scrolled, showScrollIndicator, scrollPosition } = useScroll();
  const { calculateScale, calculateTextOpacity, calculateTextTransform } = useParallax(scrollPosition, {
    baseScale: 1.1,
    maxScale: 1.3
  });
  useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const locationFeatures = [
    {
      icon: <NavigationIcon className="w-8 h-8 text-[#D4AF37]" />,
      title: "Centralna Lokacija",
      description: "Kralj Residence se nalazi u najekskluzivnijem delu Vrnjačke Banje, na samo par minuta hoda od centralnog parka i glavnih atrakcija."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#D4AF37]" />,
      title: "Dostupnost",
      description: "Sve što vam je potrebno nalazi se u neposrednoj blizini - restorani, kafići, prodavnice, apoteke i medicinske ustanove."
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#D4AF37]" />,
      title: "Povezanost",
      description: "Odlična povezanost sa glavnim saobraćajnicama i lak pristup parking prostoru za stanare i njihove goste."
    }
  ];

  const handleCloseThankYou = () => {
    setIsModalOpen(false);
    window.scrollTo({ top: 0 }); // Opcionalno, ako želiš da scroll-uješ na vrh
  };

  return (
    <div className="relative min-h-screen bg-black">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <NavigationBar scrolled={scrolled} />

      {/* Main Content */}
      <div className="relative pt-32 min-h-[200vh]">
        {/* Background Image with Overlay */}
        <div 
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("http://aislike.rs/Kralj1/A6.png")',
            opacity: 0.35,
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              mask: 'radial-gradient(circle at center, black 60%, transparent 100%)'
            }}
          />
        </div>
        
        <div className="relative w-full px-4 md:px-8 py-16">
          {/* Section Header */}
          <div className="text-left max-w-2xl mb-8 md:mb-24 px-4 md:pl-8">
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl text-[#D4AF37] mb-6 font-serif opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
              style={{ fontFamily: 'Playfair Display' }}
            >
              Udaljenost kompleksa od lokacija
            </h1>
            <p className={`text-cream-100/80 text-base md:text-xl leading-relaxed opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}>
              Kralj Residence se nalazi u najekskluzivnijem delu Vrnjačke Banje, okružen zelenilom i prirodnim lepotama, a opet na korak od svih gradskih sadržaja.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start max-w-[1920px] mx-auto">
            {/* Map Image */}
            <div className="scroll-animate from-left relative lg:col-span-8 mb-4 md:mb-0">
              <div className="relative overflow-hidden rounded-lg group transform transition-transform duration-700 hover:scale-105">
                {/* Simple Golden Border */}
                <div className="absolute -inset-4 border-2 border-[#D4AF37]/20 rounded-lg -z-10 transform transition-all duration-500 group-hover:border-[#D4AF37]/40"></div>
                <div className="absolute -inset-4 border-2 border-[#D4AF37]/10 rounded-lg -z-10 transform rotate-2 transition-all duration-500 group-hover:rotate-3 group-hover:border-[#D4AF37]/30"></div>
                
                {/* Content Container */}
                <div className="relative h-[calc(100vh-16rem)] overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="http://aislike.rs/Kralj1/MAPAA.png"
                  alt="Mapa lokacije"
                  className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Simple Corner Accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br"></div>
              </div>
            </div>

            {/* Location Details */}
            <div className="scroll-animate from-right lg:col-span-4 mt-0 md:mt-0">
              <div className="relative backdrop-blur-sm bg-[#1A1614]/80 p-8 rounded-2xl border border-[#D4AF37]/20 sticky top-28 shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="space-y-12">
                  <div>
                    <h3 className="text-[#D4AF37] text-xl md:text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
                      Kralj Residence Resort
                    </h3>
                    <ul className="space-y-2 md:space-y-3 text-cream-100/90 divide-y divide-[#D4AF37]/10">
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Centar - 520m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Dom Zdravlja - 100m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Pijaca - 250m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Opstina - 260m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Vrnjavke Terme - 370m
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] text-xl md:text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>
                      Kralj Residence Royal Aqua
                    </h3>
                    <ul className="space-y-2 md:space-y-3 text-cream-100/90 divide-y divide-[#D4AF37]/10">
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Aqua Park - 560m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Osnovna skola - 100m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Market - 300m
                      </li>
                      <li className="flex items-center py-3 first:pt-0 last:pb-0 group/item transition-colors duration-300 hover:text-cream-100">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/50 rounded-full mr-3 group-hover/item:bg-[#D4AF37] transition-colors duration-300" />
                        Zamak Kulture - 800m
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Attractions Section */}
        <div className="relative py-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/95">
            <div className="absolute inset-0 bg-[#F5E6D3]/5 mix-blend-overlay"></div>
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                  linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                backgroundPosition: 'center center',
                mask: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
              }}
            ></div>
            <div className="absolute inset-0 bg-radial-gradient"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl text-[#D4AF37] mb-6 scroll-animate"
                style={{ fontFamily: 'Playfair Display' }}
              >
                U srcu Vrnjačke Banje
              </h2>
              <p className="text-cream-100/80 text-lg max-w-3xl mx-auto leading-relaxed scroll-animate delay-200">
                Dobrodošli u Vrnjačku Banju, biser srpskog turizma. U nastavku vas očekuju najznačajnije atrakcije koje ovu banju čine jedinstvenom i nezaboravnom. 
                Upoznajte se sa mestima i doživljajima koji privlače posetioce iz celog sveta, a koji su uz život u Kralj Residence na korak od vas.
              </p>
            </div>

            {/* Attractions Grid */}
            <Swiper
              modules={[SwiperNavigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              centeredSlides
              watchSlidesProgress={true}
              speed={800}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ 
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true
              }}
              breakpoints={{
                640: { 
                  slidesPerView: 2,
                  centeredSlides: false,
                  spaceBetween: 20
                },
                1024: { 
                  slidesPerView: 3,
                  centeredSlides: false,
                  spaceBetween: 25
                },
                1280: { 
                  slidesPerView: 4,
                  centeredSlides: false,
                  spaceBetween: 30
                }
              }}
              className="attractions-swiper"
            >
              {[
                {
                  image: "http://aislike.rs/Kralj1/zamak kulture.jpg",
                  title: "Zamak Belimarković",
                  description: "Zamak Belimarković, poznat i kao Dvorac kulture, predstavlja jedan od najznačajnijih kulturno-istorijskih spomenika Vrnjačke Banje. Izgrađen je 1888. godine u stilu italijanske renesanse."
                },
                {
                  image: "http://aislike.rs/Kralj1/most ljubavi.jpg",
                  title: "Most Ljubavi",
                  description: "Most ljubavi je jedan od najromantičnijih simbola Vrnjačke Banje. Prema legendi, parovi koji zaključaju katanac na mostu i bace ključ u reku, zauvek će ostati zajedno."
                },
                {
                  image: "http://aislike.rs/Kralj1/banjski park.jpg",
                  title: "Banjski park",
                  description: "Vrnjački park je živopisan prostor za druženje i zabavu koji objedinjuje prirodu, kulturu i istoriju, pružajući posetiocima mir i opuštanje među starim lipama i skulpturama."
                },
                {
                  image: "http://aislike.rs/Kralj1/promenada.jpg",
                  title: "Promenada",
                  description: "Dugačka preko 2 km, predstavlja centralno mesto svih susreta u Vrnjačkoj Banji i obiluje udobnim mestima za predah na klupi ili osveženje u kafiću."
                },
                {
                  image: "http://aislike.rs/Kralj1/japanski vrt.jpg",
                  title: "Japanski vrt",
                  description: "Japanski vrt u Vrnjačkoj Banji predstavlja mirno utočište sa kaskadnim vodopadima, drvenim mostićem i čajnom kućicom. Pruža spokojni ambijent za odmor u prirodi."
                },
                {
                  image: "http://aislike.rs/Kralj1/izvor_sneznik_vrnjacka_banja.jpg",
                  title: "Izvor Snežnik",
                  description: "Jedan od najstarijih izvora mineralne vode u Vrnjačkoj Banji, Snežnik je poznat po svojoj lekovitoj vodi koja pomaže kod problema sa varenjem i metabolizmom."
                },
                {
                  image: "http://aislike.rs/Kralj1/aqua-park-raj.jpg",
                  title: "Aqua park",
                  description: "Moderan vodeni kompleks sa brojnim bazenima i toboganima, idealan za porodičnu zabavu i osveženje tokom toplih letnjih dana."
                }
              ].map((attraction, index) => (
                <SwiperSlide
                  key={attraction.title}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="bg-[#1A1614] border border-[#D4AF37]/20 rounded-xl transform transition-all duration-500 hover:scale-[1.02] hover:border-[#D4AF37]/40">
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden rounded-t-xl relative">
                      <img 
                        src={attraction.image} 
                        alt={attraction.title}
                        className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 transform transition-all duration-500 group-hover:translate-y-[-4px]">
                      <h3 
                        className="text-xl text-[#D4AF37] mb-3"
                        style={{ fontFamily: 'Playfair Display' }}
                      >
                        {attraction.title}
                      </h3>
                      <p className="text-cream-100/80 text-sm leading-relaxed transition-all duration-500 group-hover:text-cream-100">
                        {attraction.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

      </div>

      {/* Contact Section */}
      <div id="contact" className="relative py-32 overflow-hidden bg-[#1A1614]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#F5E6D3]/5 mix-blend-overlay" />
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="relative text-center mb-20">
            <div className="flex items-center justify-center space-x-4 mb-6 scroll-animate">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-light">Kontakt</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
            </div>
            <h2 
              className="text-5xl font-serif text-[#D4AF37] mb-6 scroll-animate delay-200" 
              style={{ fontFamily: 'Playfair Display' }}
            >
              Kontaktirajte Nas
            </h2>
            <p className="text-cream-100/90 text-xl max-w-2xl mx-auto leading-relaxed scroll-animate delay-300">
              Zainteresovani ste za neku od naših nekretnina? Pošaljite nam poruku i naš tim će vas kontaktirati u najkraćem mogućem roku.
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6 scroll-animate delay-400" />
          </div>

          {/* Contact Form Grid */}
          <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto mt-20">
            {/* Contact Information */}
            <div className="space-y-8 scroll-animate from-left delay-500 bg-black/30 p-8 rounded-lg border border-[#D4AF37]/20">
              <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0" />
              <div className="space-y-8">
                <div>
                  <h3 className="text-[#D4AF37] text-2xl mb-6" style={{ fontFamily: 'Playfair Display' }}>Kontakt Informacije</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[#D4AF37] text-lg mb-1">Telefon</h4>
                        <p className="text-cream-100/80">
                          <a href="tel:+381606112327" className="hover:text-[#D4AF37] transition-colors block">
                            +381 60 611 23 27
                          </a>
                          <a href="tel:+381606112328" className="hover:text-[#D4AF37] transition-colors block mt-1">
                            +381 60 611 2328
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[#D4AF37] text-lg mb-1">Email</h4>
                        <p className="text-cream-100/80">
                          <a href="mailto:office@kraljresidence.rs" className="hover:text-[#D4AF37] transition-colors">
                            office@kraljresidence.rs
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[#D4AF37] text-lg mb-1">Adresa</h4>
                        <p className="text-cream-100/80">
                          Kneza Miloša 6,Vrnjačka Banja<br />
                          Srbija
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br"></div>
            </div>

            {/* Contact Form */}
            <div className="scroll-animate from-right delay-700 bg-black/30 p-8 rounded-lg border border-[#D4AF37]/20">
              <ContactForm onSuccess={() => setIsModalOpen(true)} /> {/* Prosledi callback */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default Location;