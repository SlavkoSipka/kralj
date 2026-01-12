import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContactForm from './components/ContactForm';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import StatisticCard from './components/StatisticCard';
import CookieConsent from './components/CookieConsent';
import ThankYouModal from './components/ThankYouModal'; // Uvezi ThankYouModal
import { useScroll } from './hooks/useScroll';
import { useParallax } from './hooks/useParallax';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BACKGROUND_IMAGES = [
  "http://aislike.rs/Kralj1/Rudjinci A2.jpg",
  "http://aislike.rs/Kralj1/A15.png",
  "http://aislike.rs/Kralj1/A9.png",
] as const;

const SLIDE_INTERVAL = 12000; // Increased from 5s to 12s
const LOADING_DELAY = 1800;

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Dodato stanje za modal
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrolled, showScrollIndicator, scrollPosition } = useScroll();
  const { calculateScale, calculateTextOpacity, calculateTextTransform } = useParallax(scrollPosition);
  useIntersectionObserver();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, LOADING_DELAY);

    const slideInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, SLIDE_INTERVAL);
    
    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(slideInterval);
    };
  }, []);

  const handleCloseThankYou = () => {
    setIsModalOpen(false);
    window.scrollTo({ top: 0 }); // Opcionalno, ako želiš da scroll-uješ na vrh
  };

  return (
    <div className="relative min-h-screen">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <BackgroundSlideshow 
        images={BACKGROUND_IMAGES}
        currentIndex={currentImageIndex}
        calculateScale={calculateScale}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navigation scrolled={scrolled} />

        {/* Hero Content */}
        <div className="min-h-screen flex items-center relative" style={{ clipPath: 'inset(0)' }}>
          <div
            className="w-full"
            style={{
              opacity: calculateTextOpacity(),
              transform: calculateTextTransform(),
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="container-fluid px-8">
              <div className="max-w-xl">
                <h1 
                  className={`text-[#D4AF37] text-5xl md:text-6xl mb-8 leading-none tracking-tight opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : ''}`} 
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  KRALJ RESIDENCE
                </h1>
                <p 
                  className={`text-xl text-cream-100 mb-12 leading-relaxed font-light tracking-wide opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                >
                  Ekskluzivni stambeni kompleks u najlepšem delu Vrnjačke Banje, gde se luksuz susreće sa prirodom
                </p>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`relative overflow-hidden group flex items-center h-12 z-20 w-64 opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-500 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                  >
                    <span className="relative z-10 inline-flex items-center justify-center text-base uppercase tracking-wider font-light px-8 h-full w-full border border-[#D4AF37] text-[#D4AF37] transition-colors duration-300 group-hover:text-black bg-black/30 backdrop-blur-sm">
                      Nekretnine
                      <svg className={`w-4 h-4 ml-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-300 ease-out group-hover:w-full"></div>
                  </button>

                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute left-0 w-64 transition-all duration-300 origin-top z-10 ${
                      isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="bg-black/60 backdrop-blur-sm border border-[#D4AF37] border-t-0 rounded-b-lg shadow-lg overflow-hidden" 
                         style={{ boxShadow: '0 4px 30px rgba(212, 175, 55, 0.2)' }}>
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Link
                          to="/properties"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setIsDropdownOpen(false);
                          }}
                          className="block px-6 py-4 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-[15px] relative group/item"
                        >
                          <span className="relative z-10">Kralj Residence Resort</span>
                          <div className="absolute inset-0 bg-[#D4AF37]/10 transform scale-x-0 origin-left transition-transform duration-300 group-hover/item:scale-x-100"></div>
                        </Link>
                        <Link 
                          to="/royal-aqua"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-6 py-4 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-[15px] border-t border-[#D4AF37]/20 relative group/item"
                        >
                          <span className="relative z-10">Kralj Residence Royal Aqua</span>
                          <div className="absolute inset-0 bg-[#D4AF37]/10 transform scale-x-0 origin-left transition-transform duration-300 group-hover/item:scale-x-100"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative pt-32 w-full">
          {/* Clean background with border lines */}
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
          
          <div className="relative max-w-7xl mx-auto px-4">
            {/* Title above cards */}
            <div className="text-center mb-24 scroll-animate">
              <div className="inline-block relative">
                <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-4 mb-8">
                  <div className="w-8 md:w-16 h-px bg-[#D4AF37]/30 mb-4 md:mb-0"></div>
                  <h2 className="text-4xl md:text-6xl text-[#D4AF37] mb-2 md:mb-8 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                    <span className="block md:inline">Kralj Residence</span>
                    <span className="block md:inline md:ml-2">Resort</span>
                  </h2>
                  <div className="w-8 md:w-16 h-px bg-[#D4AF37]/30 mt-4 md:mt-0"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-16 mx-auto pb-32">
              {/* Kralj Residence Resort Group */}
              <div className="villas-grid">
                <div className="relative">
                  {/* Navigation Buttons (visible only on mobile) */}
                  <button 
                    onClick={() => {
                      const container = document.querySelector('.villas-scroll-container');
                      if (container) {
                        const cardWidth = container.querySelector('div')?.clientWidth || 0;
                        container.scrollLeft -= cardWidth + 24;
                      }
                    }}
                    className="scroll-nav-button prev lg:hidden"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => {
                      const container = document.querySelector('.villas-scroll-container');
                      if (container) {
                        const cardWidth = container.querySelector('div')?.clientWidth || 0;
                        container.scrollLeft += cardWidth + 24;
                      }
                    }}
                    className="scroll-nav-button next lg:hidden"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Scrollable Container */}
                  <div 
                    className="flex lg:grid lg:grid-cols-4 gap-6 lg:gap-8 overflow-x-auto pb-6 lg:pb-0 px-4 -mx-4 lg:mx-0 lg:px-0 scroll-smooth hide-scrollbar villas-scroll-container"
                  >
                    {[
                      {
                        id: 1,
                        group: "resort",
                        name: "Kralj Residence - Vila I",
                        image: "http://aislike.rs/Kralj1/A12.png",
                        size: "1200m²",
                        apartments: 23,
                        features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"],
                        status: "Prodato"
                      },
                      {
                        id: 2,
                        group: "resort",
                        name: "Kralj Residence - Vila II",
                        image: "http://aislike.rs/Kralj1/A13.png",
                        size: "1200m²",
                        apartments: 23,
                        features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"],
                        status: "Prodato"
                      },
                      {
                        id: 3,
                        group: "resort",
                        name: "Kralj Residence - Vila III",
                        image: "http://aislike.rs/Kralj1/A11.png",
                        size: "1500m²",
                        apartments: 27,
                        features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"],
                        status: "Dostupno"
                      },
                      {
                        id: 4,
                        group: "resort",
                        name: "Kralj Residence - Vila IV",
                        image: "http://aislike.rs/Kralj1/A15.png",
                        size: "1500m²",
                        apartments: 27,
                        features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"],
                        status: "Dostupno"
                      }
                    ].map((villa) => (
                      <div 
                        key={villa.id}
                        className="relative overflow-hidden rounded-none scroll-animate group flex-none w-[85vw] sm:w-[400px] lg:w-auto first:ml-[7.5vw] lg:first:ml-0"
                        style={{ 
                          transform: 'translateY(0)',
                          opacity: 1,
                          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${(villa.id) * 150}ms`
                        }}
                      >
                        <div className={`bg-[#1A1614] border border-[#D4AF37]/20 rounded-2xl relative ${
                          villa.id > 2 ? 'transform transition-all duration-500 hover:scale-[1.02] hover:border-[#D4AF37]/40 hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]' : ''
                        }`}>
                          {/* Decorative corners for available villas */}
                          {villa.id > 2 && (
                            <>
                              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/0 rounded-tl opacity-0 group-hover:opacity-100 group-hover:border-[#D4AF37]/40 transition-all duration-700"></div>
                              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/0 rounded-br opacity-0 group-hover:opacity-100 group-hover:border-[#D4AF37]/40 transition-all duration-700"></div>
                            </>
                          )}
                          {/* Image */}
                          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl relative">
                            <img 
                              src={villa.image} 
                              alt={villa.name}
                              className={`w-full h-full object-cover shadow-none ${
                                villa.id > 2 ? 'transform transition-all duration-500 ease-out group-hover:scale-105' : ''
                              }`}
                            />
                            <div className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${
                              villa.id > 2 ? 'opacity-0 group-hover:opacity-100' : 'opacity-30'
                            }`}></div>
                            {villa.id > 2 && (
                              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            )}
                          </div>

                          {/* Villa Details */}
                          <div className={`p-8 rounded-b-2xl ${villa.id > 2 ? 'transform transition-all duration-300 group-hover:translate-y-[-2px]' : ''}`}>
                            <h2 className="text-xl text-[#D4AF37] font-serif mb-4 font-medium">{villa.name}</h2>

                            <div className="grid grid-cols-2 gap-4 text-white/90 mb-4 border-b border-[#D4AF37]/20 pb-4">
                              <div>
                                <p className="text-[#D4AF37] font-medium text-xs mb-1">Površina</p>
                                <p className="text-lg font-medium">{villa.size}</p>
                              </div>
                              <div>
                                <p className="text-[#D4AF37] font-medium text-xs mb-1">Stanovi</p>
                                <p className="text-lg font-medium">{villa.apartments}</p>
                              </div>
                            </div>
                            
                            {/* Features */}
                            <div className={`space-y-2 ${villa.id > 2 ? 'mb-4' : 'mb-8'}`}>
                              {villa.features.map((feature, index) => (
                                <p key={index} className="text-white/80 text-base flex items-center">
                                  <span className="inline-block w-1 h-1 bg-[#D4AF37] rounded-full mr-3" />
                                  {feature}
                                </p>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-end pt-4 border-t border-[#D4AF37]/20">
                              {villa.id <= 2 ? (
                                <span className="relative overflow-hidden bg-[#D4AF37] text-black px-6 py-2 rounded-lg text-sm tracking-wider font-medium shadow-lg border border-[#D4AF37]/50 inline-flex items-center">
                                  PRODATO
                                </span>
                              ) : (
                                <Link 
                                  to={villa.id === 3 ? "/villa-3" : villa.id === 4 ? "/villa-4" : "#"}
                                  className="relative overflow-hidden bg-[#D4AF37] text-black px-6 py-2 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5C048] hover:scale-105 group border border-[#D4AF37]/50"
                                >
                                  <span className="relative z-10">
                                  PONUDA STANOVA
                                  </span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#E5C048] via-white to-[#E5C048] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kralj Residence Royal Aqua Section */}
              <div className="w-full mt-32">
                <div className="text-center mb-24 scroll-animate">
                  <div className="inline-block relative">
                    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-4 mb-8">
                      <div className="w-8 md:w-16 h-px bg-[#D4AF37]/30 mb-4 md:mb-0"></div>
                      <h2 className="text-4xl md:text-6xl text-[#D4AF37] mb-2 md:mb-8 font-serif" style={{ fontFamily: 'Playfair Display' }}>
                        Kralj Residence Royal Aqua
                      </h2>
                      <div className="w-8 md:w-16 h-px bg-[#D4AF37]/30 mt-4 md:mt-0"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div 
                    className="relative overflow-hidden rounded-none scroll-animate group max-w-sm"
                    style={{ transitionDelay: '500ms' }}
                  >
                    <div className="bg-[#1A1614] border border-[#D4AF37]/20 rounded-2xl relative transform transition-all duration-700 hover:scale-[1.02] hover:border-[#D4AF37]/40 hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                      {/* Image */}
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl relative">
                        <img 
                          src="http://aislike.rs/Kralj1/Rudjinci A2.jpg"
                          alt="Kralj Residence Royal Aqua"
                          className="w-full h-full object-cover transform transition-all duration-1000 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                      </div>

                      <div className="p-8 rounded-b-2xl transform transition-all duration-500 group-hover:translate-y-[-4px]">
                        <h2 className="text-xl text-[#D4AF37] font-serif mb-4 font-medium">Kralj Residence - Royal Aqua</h2>

                        <div className="grid grid-cols-2 gap-4 text-white/90 mb-4 border-b border-[#D4AF37]/20 pb-4">
                          <div>
                            <p className="text-[#D4AF37] font-medium text-xs mb-1">Površina</p>
                            <p className="text-lg font-medium">1500m²</p>
                          </div>
                          <div>
                            <p className="text-[#D4AF37] font-medium text-xs mb-1">Stanovi</p>
                            <p className="text-lg font-medium">27</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-white/80 text-base flex items-center">
                            <span className="inline-block w-1 h-1 bg-[#D4AF37] rounded-full mr-3" />
                            Privatni bazen
                          </p>
                          <p className="text-white/80 text-base flex items-center">
                            <span className="inline-block w-1 h-1 bg-[#D4AF37] rounded-full mr-3" />
                            Uređeno dvorište
                          </p>
                          <p className="text-white/80 text-base flex items-center">
                            <span className="inline-block w-1 h-1 bg-[#D4AF37] rounded-full mr-3" />
                            Ekskluzivna lokacija
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-end pt-4 border-t border-[#D4AF37]/20">
                          <Link 
                            to="/royal-aqua"
                            className="relative overflow-hidden bg-[#D4AF37] text-black px-6 py-2 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#E5C048] hover:scale-105 group border border-[#D4AF37]/50"
                          >
                            <span className="relative z-10">
                            Ponuda stanova
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E5C048] via-white to-[#E5C048] transform scale-x-0 origin-left transition-transform duration-700 ease-out group-hover:scale-x-100"></div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showScrollIndicator && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 flex flex-col items-center">
            <ChevronDown className="h-8 w-8 text-[#D4AF37] animate-bounce" />
            <p className="text-cream-100 text-sm mt-2 text-center">Skrolujte za više</p>
          </div>
        )}
        

        {/* About Us Section */}
        <div id="about" ref={aboutSectionRef} className="relative pt-32 pb-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/95"></div>
            <div 
              className="absolute inset-0 opacity-10"
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

          {/* Section Header */}
          <div className="relative text-center mb-24 z-10">
            <div className="flex items-center justify-center space-x-4 mb-6 scroll-animate">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-light">O nama</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
            </div>
            <h2 className="text-5xl font-serif text-[#D4AF37] mb-6 scroll-animate delay-200" style={{ fontFamily: 'Playfair Display' }}>
              Kralj Residence
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2 scroll-animate delay-300"></div>
          </div>

          {/* Top Image and Text */}
          <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center mb-32 scroll-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:col-span-7 lg:col-start-1 relative group transform transition-transform duration-700 hover:scale-105 scroll-animate from-left delay-400">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                <img 
                  src="http://aislike.rs/Kralj1/hotel kralj slika.jpg"
                  alt="Kralj Residence Bazen"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -inset-4 border-2 border-[#D4AF37]/20 rounded-lg -z-10 transform transition-all duration-500 group-hover:border-[#D4AF37]/40"></div>
              <div className="absolute -inset-4 border-2 border-[#D4AF37]/10 rounded-lg -z-10 transform rotate-2 transition-all duration-500 group-hover:rotate-3 group-hover:border-[#D4AF37]/30"></div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br"></div>
            </div>

            <div className="lg:col-span-5 lg:pl-12 scroll-animate from-right delay-500">
              <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 rounded-lg border border-[#D4AF37]/10">
                <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[#D4AF37] text-3xl mb-4 font-medium" style={{ fontFamily: 'Playfair Display' }}>
                      O nama
                    </h3>
                    <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-cream-100/90 text-lg leading-relaxed">
                      Kralj Residence je ogranak kompanije Kralj doo, koja već tri decenije uspešno posluje u Vrnjačkoj Banji. Sa iskustvom u ugostiteljstvu i turizmu, kao i radom u prestižnom hotelu Kralj koji je prisutan na tržištu skoro 20 godina, Kralj doo je stekao izuzetnu reputaciju za kvalitet i uslugu.
                    </p>
                    <p className="text-cream-100/90 text-lg leading-relaxed">
                      Od 2008. godine, ogranak Kralj Residence se specijalizovao za izgradnju luksuznih stambenih kompleksa i ekskluzivnih stanova. Naša posvećenost vrhunskom dizajnu, sigurnosti i udobnosti garantuje visok standard stanovanja koji zadovoljava potrebe savremenih kupaca.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content Grid */}
            <div className="space-y-32">
              {/* First Image and Text */}
              <div className="grid lg:grid-cols-12 gap-16 items-center scroll-fade-in order-2 lg:order-none">
                <div className="lg:col-span-5 lg:col-start-1 lg:pl-12 scroll-animate from-left delay-500 order-2 lg:order-none">
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 rounded-lg border border-[#D4AF37]/10">
                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[#D4AF37] text-3xl mb-4 scroll-animate delay-600" style={{ fontFamily: 'Playfair Display' }}>Naša Vizija</h4>
                          <p className="text-cream-100/90 text-lg leading-relaxed scroll-animate delay-700">
                            Naša vizija je da Kralj Residence postane sinonim za kvalitetnu gradnju i luksuz u Vrnjačkoj Banji. Nastojimo da svaka naša investicija doprinese unapređenju infrastrukture i životnog standarda, stvarajući domove koji su više od mesta za život.
                          </p>
                          <p className="text-cream-100/90 text-lg leading-relaxed mt-6 scroll-animate delay-800">
                            Kroz inovativne projekte i pažljivo odabrane lokacije, želimo da nastavimo da razvijamo prepoznatljiv brend koji inspiriše i zadovoljava naše klijente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 lg:col-start-6 relative group transform transition-transform duration-700 hover:scale-105 scroll-animate from-right delay-400 order-1 lg:order-none">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                    <img 
                      src="http://aislike.rs/Kralj1/A10.png"
                      alt="Kralj Residence Eksterijer"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="absolute -inset-4 border-2 border-[#D4AF37]/20 rounded-lg -z-10 transform transition-all duration-500 group-hover:border-[#D4AF37]/40"></div>
                  <div className="absolute -inset-4 border-2 border-[#D4AF37]/10 rounded-lg -z-10 transform rotate-2 transition-all duration-500 group-hover:rotate-3 group-hover:border-[#D4AF37]/30"></div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br"></div>
                </div>
              </div>

              {/* Statistics Section integrated within About Us */}
              <div className="relative py-16 hidden lg:block">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatisticCard
                    icon={
                      <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    }
                    endValue={4800}
                    label="Površina Kompleksa (m²)"
                    unit="m²"
                  />
                  <StatisticCard
                    icon={
                      <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    }
                    endValue={98}
                    label="Stambenih jedinica"
                    delay={600}
                  />
                  <StatisticCard
                    icon={
                      <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    }
                    endValue={69}
                    label="Parking mesta"
                    delay={800}
                  />
                </div>
              </div>
              
              {/* Mobile Image and Text (Visible only on mobile) */}
              <div className="lg:hidden relative py-16">
                <div className="relative group transform transition-transform duration-700 hover:scale-105 scroll-animate from-right delay-400">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
                    <img 
                      src="http://aislike.rs/Kralj1/Kralj.jpg"
                      alt="Kralj Residence Enterijer"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="absolute -inset-4 border-2 border-[#D4AF37]/20 rounded-lg -z-10 transform transition-all duration-500 group-hover:border-[#D4AF37]/40"></div>
                  <div className="absolute -inset-4 border-2 border-[#D4AF37]/10 rounded-lg -z-10 transform -rotate-2 transition-all duration-500 group-hover:-rotate-3 group-hover:border-[#D4AF37]/30"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/40 rounded-tr"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/40 rounded-bl"></div>
                </div>
                
                <div className="mt-8">
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 rounded-lg border border-[#D4AF37]/10">
                    <div className="absolute -right-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[#D4AF37] text-3xl mb-3 font-medium" style={{ fontFamily: 'Playfair Display' }}>
                          Tradicija i Kvalitet
                        </h3>
                        <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[#D4AF37] text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>Tradicija Luksuza</h4>
                          <p className="text-cream-100/80 text-lg leading-relaxed">
                            Hotel Kralj je jedan od najluksuznijih hotela u Vrnjačkoj Banji, sa tradicijom dugom preko dve decenije.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-[#D4AF37] text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>Ekskluzivna Lokacija</h4>
                          <p className="text-cream-100/80 text-lg leading-relaxed">
                            Smešten u samom srcu banje, hotel nudi jedinstveno iskustvo boravka u elegantno uređenim sobama i apartmanima.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-[#D4AF37] text-2xl mb-4" style={{ fontFamily: 'Playfair Display' }}>Premium Sadržaji</h4>
                          <p className="text-cream-100/80 text-lg leading-relaxed">
                            Sa svojim wellness centrom, restoranom domaće i internacionalne kuhinje, i profesionalnim osobljem, Hotel Kralj postavlja standarde u hotelijerstvu Vrnjačke Banje.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parallax Gap Section */}
        <div className="relative h-[50vh] overflow-hidden bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{
              backgroundImage: 'url("http://aislike.rs/Kralj1/Stan 17 S1.png")',
              filter: 'brightness(0.7)',
              backgroundAttachment: 'fixed'
            }}
          />
          <div 
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{
              backgroundImage: 'url("http://aislike.rs/Kralj1/Stan 17 S1.png")',
              filter: 'brightness(0.7)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90" />
          
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #D4AF37 1px, transparent 1px),
                  linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                backgroundPosition: 'center center'
              }}
            />
          </div>
        </div>

        {/* Attractions Section */}
        <div className="relative py-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black/95">
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

        {/* Contact Section */}
        <div id="contact" className="relative py-16 overflow-hidden bg-gradient-to-b from-black via-[#2A2522] to-[#1A1614]">
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Zainteresovani ste za neku od naših nekretnina? Pošaljite nam poruku i naš tim će vas kontaktirati u najkraćem mogućem roku.
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6 scroll-animate delay-400"></div>
            </div>

            {/* Contact Information */}
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
                              <a href="tel:+381642198443" className="hover:text-[#D4AF37] transition-colors block mt-1">
                                +381 64 219 8443
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
                              Kneza Miloša 6, Vrnjačka Banja<br />
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
                <ContactForm onSuccess={() => setIsModalOpen(true)} /> {/* Prosledi callback */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
        <CookieConsent />
        <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} autoCloseDelay={2000} />
      </div>
    </div>
  );
}

export default App