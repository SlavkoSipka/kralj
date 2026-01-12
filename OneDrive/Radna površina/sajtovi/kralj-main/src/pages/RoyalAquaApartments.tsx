import { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { ANIMATION_DELAYS, SAMPLE_APARTMENT } from '../constants';
import ContactForm from '../components/ContactForm';
import {
  ROYAL_AQUA_GROUND_FLOOR_APARTMENTS,
  ROYAL_AQUA_FIRST_FLOOR_APARTMENTS,
  ROYAL_AQUA_SECOND_FLOOR_APARTMENTS,
  ROYAL_AQUA_THIRD_FLOOR_APARTMENTS,
  ROYAL_AQUA_PENTHOUSE_APARTMENTS,
  getFloorName
} from '../constants/royalAquaApartments';
import { useModal } from '../hooks/useModal';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ApartmentModal from '../components/ApartmentModal';
import FloorSection from '../components/FloorSection';
import ThankYouModal from '../components/ThankYouModal';
import { useScroll } from '../hooks/useScroll';
import { useParallax } from '../hooks/useParallax';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const RoyalAquaApartments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<null | { id: number; number: number; size: number }>(null);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
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

  return (
    <div className="relative min-h-screen bg-black villa-page overflow-x-hidden">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* Hero Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("http://aislike.rs/Kralj1/Rudjinci A2.jpg")`,
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
                  Kralj Residence - Royal Aqua
                </h1>
                <p 
                  className={`text-xl text-cream-100 mb-12 leading-relaxed font-light tracking-wide opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                >
                  Otkrijte našu ekskluzivnu ponudu stanova u Royal Aqua kompleksu. Svaka jedinica je pažljivo dizajnirana da pruži savršen spoj luksuza, udobnosti i funkcionalnosti.
                </p>
              </div>
            </div>
          </div>

          {/* Floor Sections */}
          <FloorSection
            title="Nisko Prizemlje"
            apartments={ROYAL_AQUA_GROUND_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Visoko Prizemlje"
            apartments={ROYAL_AQUA_FIRST_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Prvi Sprat"
            apartments={ROYAL_AQUA_SECOND_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Drugi Sprat"
            apartments={ROYAL_AQUA_THIRD_FLOOR_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
          
          <FloorSection
            title="Povučeni Sprat"
            apartments={ROYAL_AQUA_PENTHOUSE_APARTMENTS}
            onSelectApartment={(apt) => {
              setSelectedApartment(apt);
              open();
            }}
          />
        </div>

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
                Zainteresovani ste za neki od stanova u Royal Aqua? Pošaljite nam poruku i naš tim će vas kontaktirati u najkraćem mogućem roku.
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
                <ContactForm onSuccess={() => setIsThankYouOpen(true)} />
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
            image: selectedApartment?.image || apartment.image,
            size: selectedApartment?.size || apartment.size,
            number: selectedApartment?.number || 0,
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

export default RoyalAquaApartments;