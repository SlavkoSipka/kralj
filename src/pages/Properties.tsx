import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import ResortModal from '../components/ResortModal';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import Footer from '../components/Footer';
import ThankYouModal from '../components/ThankYouModal'; // Uvezi ThankYouModal
import { useScroll } from '../hooks/useScroll';
import { useParallax } from '../hooks/useParallax';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Properties = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Za ResortModal
  const [isThankYouOpen, setIsThankYouOpen] = useState(false); // Dodato stanje za ThankYouModal
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrolled, showScrollIndicator, scrollPosition } = useScroll();
  const { calculateScale, calculateTextOpacity, calculateTextTransform } = useParallax(scrollPosition, { baseScale: 1.1, maxScale: 1.3 });
  useIntersectionObserver();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Auto-scroll effect for mobile
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 100;
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollLeft = 0;
              scrollContainerRef.current.style.scrollBehavior = 'smooth';
            }
          }, 800);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleScroll = (direction: 'prev' | 'next') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('div[class*="flex-none"]')?.clientWidth || 0;
      const scrollAmount = cardWidth + 24; // 24px is the gap between cards
      container.scrollLeft += direction === 'next' ? scrollAmount : -scrollAmount;
    }
  };

  const villas = [
    {
      id: 1,
      group: "resort",
      name: "Kralj Residence - Vila I",
      image: "http://aislike.rs/Kralj1/A12.png",
      size: "1200m²",
      apartments: 23,
      features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"]
    },
    {
      id: 2,
      group: "resort",
      name: "Kralj Residence - Vila II",
      image: "http://aislike.rs/Kralj1/A13.png",
      size: "1200m²",
      apartments: 23,
      features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"]
    },
    {
      id: 3,
      group: "resort",
      name: "Kralj Residence - Vila III",
      image: "http://aislike.rs/Kralj1/A11.png",
      size: "1500m²",
      apartments: 27,
      features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"]
    },
    {
      id: 4,
      group: "resort",
      name: "Kralj Residence - Vila IV",
      image: "http://aislike.rs/Kralj1/A15.png",
      size: "1500m²",
      apartments: 27,
      features: ["Privatni bazen", "Igralište za decu", "Paviljon za roštilj"]
    }
  ];

  const handleCloseThankYou = () => {
    setIsThankYouOpen(false);
    window.scrollTo({ top: 0 }); // Opcionalno, ako želiš da scroll-uješ na vrh
  };

  return (
    <div className="relative min-h-screen bg-black">
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      <Navigation scrolled={scrolled} />

      {/* Hero Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("http://aislike.rs/Kralj1/Rudjinci A1.jpg")`,
          transform: `scale(${calculateScale()})`,
          filter: 'brightness(0.65)',
          transition: 'transform 0.5s ease-out'
        }}
      />

      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 w-full">
        <div className="w-full pt-20">
          {/* Hero Section */}
          <div
            className="min-h-[90vh] md:min-h-screen flex items-center relative"
            style={{ opacity: calculateTextOpacity() }}
          >
            <div className="w-full">
              <div className="container-fluid px-8 pt-8 md:pt-0">
                <div className="max-w-xl">
                  <h1 
                    className={`text-5xl md:text-6xl text-[#D4AF37] mb-8 leading-none tracking-tight opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                    style={{ fontFamily: 'Playfair Display', whiteSpace: 'nowrap' }}
                  >
                    Kralj Residence
                  </h1>
                  <p 
                    className={`text-xl text-cream-100 mb-12 leading-relaxed font-light tracking-wide opacity-0 transform -translate-y-10 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                  >
                    Dobrodošli u svet gde luksuz postaje standard.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          {showScrollIndicator && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 flex flex-col items-center">
              <ChevronDown className="h-8 w-8 text-[#D4AF37] animate-bounce" />
              <p className="text-cream-100 text-sm mt-2 text-center">Skrolujte za više</p>
            </div>
          )}

          {/* Villas Grid */}
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
                  <div className="flex justify-center">
                    <Link
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                      to="#"
                      className="group relative inline-flex items-center justify-center px-16 py-4 overflow-hidden font-medium transition-all bg-transparent border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black"
                    >
                      <span className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#D4AF37]/10 backdrop-blur-sm transition-all duration-500 group-hover:bg-[#D4AF37]"></span>
                      <span className="relative text-[#D4AF37] group-hover:text-black transition-colors duration-300 flex items-center">
                        Saznaj detalje
                        <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-16 mx-auto pb-32">
                {/* Kralj Residence Resort Group */}
                <div className="villas-grid">
                  <div className="relative">
                    {/* Navigation Buttons (visible only on mobile) */}
                    <button 
                      onClick={() => handleScroll('prev')}
                      className="scroll-nav-button prev lg:hidden"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleScroll('next')}
                      className="scroll-nav-button next lg:hidden"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Scrollable Container */}
                    <div 
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto gap-6 pb-6 lg:grid lg:grid-cols-4 lg:gap-8 px-4 -mx-4 lg:mx-0 lg:px-0 scroll-smooth hide-scrollbar"
                    >
                    {villas.map((villa, index) => (
                      <div 
                        key={villa.id}
                        className={`relative overflow-hidden rounded-none flex-none w-[85vw] sm:w-[400px] lg:w-auto first:ml-[7.5vw] lg:first:ml-0 ${villa.id > 2 ? 'group' : ''}`}
                        style={{ 
                          transform: 'translateY(0)',
                          opacity: 1,
                          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${(index + 1) * 150}ms`
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
                      <div className="flex justify-center">
                        <Link
                          to="#"
                          className="group relative inline-flex items-center justify-center px-16 py-4 overflow-hidden font-medium transition-all bg-transparent border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black"
                        >
                          <span className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#D4AF37]/10 backdrop-blur-sm transition-all duration-500 group-hover:bg-[#D4AF37]"></span>
                          <span className="relative text-[#D4AF37] group-hover:text-black transition-colors duration-300 flex items-center">
                            SAZNAJ DETALJE
                            <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </Link>
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
                              PONUDA STANOVA
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

          {/* Contact Section */}
          <div className="relative h-[70vh] overflow-hidden w-full">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: 'url("http://aislike.rs/Kralj1/Kralj 1.png")',
                filter: 'brightness(0.65)',
                backgroundAttachment: 'fixed'
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

          <div id="contact" className="relative py-32 overflow-hidden bg-[#1A1614] w-full">
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

              {/* Contact Form */}
              <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto mt-20">
                {/* Contact Information */}
                <div className="space-y-8 scroll-animate from-left delay-500">
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-black/30 via-black/20 to-black/10 p-8 rounded-lg border border-[#D4AF37]/10">
                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0" />
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[#D4AF37] text-2xl mb-6" style={{ fontFamily: 'Playfair Display' }}>Informacije</h3>
                        <div className="space-y-8">
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

          {/* Footer */}
          <Footer />
        </div>
      </div>
      
      {/* Resort Modal */}
      <ResortModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* ThankYouModal */}
      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default Properties;