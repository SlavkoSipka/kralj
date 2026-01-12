import { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ANIMATION_DELAYS, SAMPLE_APARTMENT } from '../constants';
import ContactForm from '../components/ContactForm';
import {
  GROUND_FLOOR_APARTMENTS,
  FIRST_FLOOR_APARTMENTS,
  SECOND_FLOOR_APARTMENTS,
  THIRD_FLOOR_APARTMENTS,
  PENTHOUSE_APARTMENTS,
  getFloorName
} from '../constants/apartments';
import { useModal } from '../hooks/useModal';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ApartmentModal from '../components/ApartmentModal';
import FloorSection from '../components/FloorSection';
import ThankYouModal from '../components/ThankYouModal'; // Uvezi ThankYouModal
import { useScroll } from '../hooks/useScroll';
import { useParallax } from '../hooks/useParallax';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const VillaApartments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<null | { id: number; number: number; size: number }>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false); // Dodato stanje za ThankYouModal
  const { isOpen, open, close } = useModal();
  const { scrolled, showScrollIndicator, scrollPosition } = useScroll();
  const { calculateScale, calculateTextOpacity, calculateTextTransform } = useParallax(scrollPosition);
  useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, ANIMATION_DELAYS.LOADING);

    return () => clearTimeout(timer);
  }, []);

  const apartment = SAMPLE_APARTMENT;

  const handleCloseThankYou = () => {
    setIsThankYouOpen(false);
    window.scrollTo({ top: 0 }); // Opcionalno, ako želiš da scroll-uješ na vrh
  };

  return (
    <div className="relative min-h-screen bg-black villa-page overflow-x-hidden">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* Hero Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("http://aislike.rs/Kralj1/vila3/Kralj k4 (1).png")`,
          transform: `scale(${calculateScale()})`,
          filter: 'brightness(0.65)',
          transition: 'transform 0.5s ease-out'
        }}
      />

      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 w-full">
        <div className="w-full pt-32">
          {/* Hero Section */}
          <div
            className="min-h-[80vh] flex items-center"
            style={{
              opacity: calculateTextOpacity(),
              transform: calculateTextTransform(),
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
            }}
          >
            <div className="container-fluid px-8">
              <div className="max-w-2xl">
                <h1 
                  className={`text-5xl md:text-6xl text-[#D4AF37] mb-8 leading-none tracking-tight opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Kralj Residence - Vila III
                </h1>
                <p 
                  className={`text-xl text-cream-100 mb-12 leading-relaxed font-light tracking-wide opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                >
                  Otkrijte našu ekskluzivnu ponudu stanova u Vili III. Svaka jedinica je pažljivo dizajnirana da pruži savršen spoj luksuza, udobnosti i funkcionalnosti.
                </p>
                <div className={`opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-500 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}>
                  <Link
                    to="/villa-4"
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-all bg-black/40 border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transform hover:scale-[1.02] backdrop-blur-sm"
                  >
                    <span className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#D4AF37]/10 backdrop-blur-sm transition-all duration-500 group-hover:bg-[#D4AF37]"></span>
                    <span className="relative text-[#D4AF37] group-hover:text-black transition-colors duration-300 flex items-center">
                      Pogledajte Vilu IV
                      <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floor Sections */}
          <FloorSection
            title="Nisko Prizemlje"
            apartments={GROUND_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Visoko Prizemlje"
            apartments={FIRST_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Prvi Sprat"
            apartments={SECOND_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Drugi Sprat"
            apartments={THIRD_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Povučeni Sprat"
            apartments={PENTHOUSE_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
        </div>

        {/* Modal */}
        <ApartmentModal
          isOpen={isOpen}
          onClose={() => {
            close();
            setSelectedApartment(null);
          }}
          apartment={{
            ...apartment,
            name: selectedApartment ? `Stan Broj ${selectedApartment.number} - ${
              selectedApartment.type
            }` : '',
            image: selectedApartment?.number === 22 ?
              "http://aislike.rs/Kralj1/vila3/stan 22.png" :
              selectedApartment?.number === 23 ?
              "http://aislike.rs/Kralj1/vila3/stan 23.png" :
              selectedApartment?.number === 24 ?
              "http://aislike.rs/Kralj1/vila3/stan 24.png" :
              selectedApartment?.number === 25 ?
              "http://aislike.rs/Kralj1/vila3/stan 25.png" :
              selectedApartment?.number === 26 ?
              "http://aislike.rs/Kralj1/vila3/stan 26.png" :
              selectedApartment?.number === 27 ?
              "http://aislike.rs/Kralj1/vila3/stan 27.png" :
              selectedApartment?.image || apartment.image,
            size: selectedApartment?.size || apartment.size,
            floor: selectedApartment ? getFloorName(selectedApartment.number) : apartment.floor,
            status: 'Dostupno'
          }}
        />

        {/* Contact Section */}
        <div id="contact" className="relative py-32 overflow-hidden bg-[#1A1614]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[#F5E6D3]/5 mix-blend-overlay"></div>
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                  linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-8">
            {/* Section Header */}
            <div className="relative text-center mb-20">
              <div className="flex items-center justify-center space-x-4 mb-6 scroll-animate">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
                <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-light">Kontakt</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
              </div>
              <h2 
                className="text-5xl font-serif text-[#D4AF37] mb-6 scroll-animate delay-200" 
                style={{ fontFamily: 'Playfair Display' }}
              >
                Kontaktirajte Nas
              </h2>
              <p className="text-cream-100/90 text-xl max-w-2xl mx-auto leading-relaxed scroll-animate delay-300">
                Zainteresovani ste za neki od stanova u Vili III? Pošaljite nam poruku i naš tim će vas kontaktirati u najkraćem mogućem roku.
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6 scroll-animate delay-400"></div>
            </div>

            {/* Contact Grid */}
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto mt-20">
              {/* Contact Information */}
              <div className="space-y-8 scroll-animate from-left delay-500">
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 rounded-lg border border-[#D4AF37]/10">
                  <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[#D4AF37] text-2xl mb-6" style={{ fontFamily: 'Playfair Display' }}>Informacije</h3>
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
                                +381 60 611 2327
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
                </div>
              </div>

              {/* Contact Form */}
              <div className="scroll-animate from-right delay-700">
                <ContactForm onSuccess={() => setIsThankYouOpen(true)} /> {/* Prosledi callback */}
              </div>
            </div>
          </div>
        </div>

        <Footer />
        
        {/* Apartment Modal */}
        <ApartmentModal
          isOpen={isOpen}
          onClose={() => {
            close();
            setSelectedApartment(null);
          }}
          apartment={{
            ...apartment,
            name: selectedApartment ? `Stan Broj ${selectedApartment.number} - ${
              selectedApartment.type
            }` : '',
            image: selectedApartment?.number === 22 ?
              "http://aislike.rs/Kralj1/vila3/stan 22.png" :
              selectedApartment?.number === 23 ?
              "http://aislike.rs/Kralj1/vila3/stan 23.png" :
              selectedApartment?.number === 24 ?
              "http://aislike.rs/Kralj1/vila3/stan 24.png" :
              selectedApartment?.number === 25 ?
              "http://aislike.rs/Kralj1/vila3/stan 25.png" :
              selectedApartment?.number === 26 ?
              "http://aislike.rs/Kralj1/vila3/stan 26.png" :
              selectedApartment?.number === 27 ?
              "http://aislike.rs/Kralj1/vila3/stan 27.png" :
              selectedApartment?.image || apartment.image,
            size: selectedApartment?.size || apartment.size,
            floor: selectedApartment ? getFloorName(selectedApartment.number) : apartment.floor,
            status: 'Dostupno'
          }}
        />
        
        {/* ThankYouModal */}
        <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
      </div>
    </div>
  );
};

export default VillaApartments;