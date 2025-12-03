import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, MessageSquare, CheckCircle, ArrowRight, Menu, X, Brain, Cpu, Bot, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';
import { NavLink, MobileNavLink } from '../navigation/NavLink';
import { PortfolioCard } from '../cards/PortfolioCard';
import { Hero } from '../sections/Hero';
import { YouTubeVideo } from '../video/YouTubeVideo';
import { rafThrottle } from '../../utils/performance';
import { Link, useNavigate } from 'react-router-dom';
import { trackCTAClick, trackNavigationClick, trackContactInfoClick, trackPortfolioClick } from '../../utils/analytics';

export function HomePage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const parallaxRefs = useRef<HTMLElement[]>([]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      // Only show side nav on desktop devices
      if (!isMobile) {
        setShowSideNav(scrollPosition > 200);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    const handleParallax = rafThrottle(() => {
      parallaxRefs.current.forEach(element => {
        const rect = element.getBoundingClientRect();
        const scrollOffset = window.innerHeight - rect.top;
        if (scrollOffset > 0) {
          const parallaxValue = Math.min(scrollOffset * 0.15, 100);
          element.style.setProperty('--scroll-offset', `${parallaxValue}px`);
        }
      });
    });

    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  useEffect(() => {
    // Optimize Intersection Observer with single instance
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            const target = entry.target;
            
            if (!entry.isIntersecting) {
              target.classList.remove('visible');
              if (target.classList.contains('grid')) {
                const children = Array.from(target.children);
                children.forEach(item => {
                  item.classList.remove('visible');
                  for (let i = 1; i <= 12; i++) {
                    item.classList.remove(`stagger-delay-${i}`);
                  }
                });
              }
              return;
            }
            
            if (entry.isIntersecting) {
              target.classList.add('visible');
              if (target.classList.contains('grid')) {
                const children = Array.from(target.children);
                children.forEach((item, index) => {
                  item.classList.add(`stagger-delay-${index + 1}`);
                  item.classList.add('visible');
                });
              }
            }
          });
        });
      },
      options
    );

    // Observe all animation elements
    const elementsToObserve = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in, .parallax-scroll, .stagger-grid-item, .fly-in-left, .fly-in-right, .portfolio-card-reveal, .video-reveal, .founder-reveal, .service-image-reveal, .service-text-reveal, .section-header-reveal, .badge-reveal');
    elementsToObserve.forEach((element) => {
      observerRef.current?.observe(element);
      if (element.classList.contains('parallax-scroll')) {
        parallaxRefs.current.push(element as HTMLElement);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Top Navigation Bar - Large, appears at top (always visible on mobile) */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${
        showSideNav && !isMobile ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      } ${isScrolled ? 'bg-white/98 shadow-md' : 'bg-white/80'} nav-blur`}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link 
              to="/" 
              className="flex items-center group py-2"
              aria-label="AI Sajt - Početna stranica"
            >
              <img 
                src="/images/providna2.png" 
                alt="AiSajt Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <NavLink onClick={() => {
                trackNavigationClick('Services', language);
                scrollToSection('services');
              }}>{t.services}</NavLink>
              <NavLink onClick={() => {
                trackNavigationClick('Portfolio', language);
                scrollToSection('why-us');
              }}>{t.portfolio}</NavLink>
              <NavLink onClick={() => {
                trackNavigationClick('About Us', language);
                scrollToSection('video-section');
              }}>{t.aboutUs}</NavLink>
              <button
                onClick={() => {
                  trackCTAClick('Kontakt - Top Navigation', 'top_nav', language);
                  navigate('/contact');
                }}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm uppercase tracking-wide"
                aria-label="Kontaktirajte nas"
              >
                {t.contact}
              </button>
              
              {/* Language Switcher Toggle */}
              <div className="flex gap-1 border-2 border-gray-900 rounded-full p-1">
                <button
                  onClick={() => setLanguage('sr')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'sr'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  SR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-xl shadow-violet-500/10 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 -translate-y-4 invisible'
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <MobileNavLink onClick={() => {
              trackNavigationClick('Services', language);
              scrollToSection('services');
            }}>{t.services}</MobileNavLink>
            <MobileNavLink onClick={() => {
              trackNavigationClick('Portfolio', language);
              scrollToSection('why-us');
            }}>{t.portfolio}</MobileNavLink>
            <MobileNavLink onClick={() => {
              trackNavigationClick('About Us', language);
              scrollToSection('video-section');
            }}>{t.aboutUs}</MobileNavLink>
            
            {/* Language Switcher Toggle - Mobile */}
            <div className="px-4 py-2 flex justify-center">
              <div className="flex gap-1 bg-gray-700 rounded-full p-1">
                <button
                  onClick={() => setLanguage('sr')}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                    language === 'sr'
                      ? 'bg-white text-gray-700 shadow-md'
                      : 'bg-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  SR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-white text-gray-700 shadow-md'
                      : 'bg-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                trackCTAClick('Kontakt - Mobile Menu', 'mobile_nav', language);
                navigate('/contact');
              }}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300"
              aria-label="Kontaktirajte nas - Mobilni meni"
            >
              {t.contact}
            </button>
          </div>
        </div>
      </nav>

      {/* Side Navigation Bar - Appears on right when scrolling */}
      <nav className={`hidden md:block fixed top-1/2 -translate-y-1/2 right-0 z-50 transition-all duration-700 ${
        showSideNav ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-white/98 backdrop-blur-md shadow-2xl rounded-l-3xl px-4 py-8 flex flex-col items-center gap-6 border-l-4 border-violet-500">
          {/* Logo */}
          <Link 
            to="/" 
            className="group mb-2"
            aria-label="AI Sajt - Početna stranica"
          >
            <img 
              src="/images/providna2.png" 
              alt="AiSajt Logo" 
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Vertical Navigation Links */}
          <div className="flex flex-col items-stretch gap-3 w-full px-2">
            <button
              onClick={() => {
                trackNavigationClick('Services', language);
                scrollToSection('services');
              }}
              className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-x-1 whitespace-nowrap border border-gray-200 hover:border-transparent"
            >
              {t.services}
            </button>
            
            <button
              onClick={() => {
                trackNavigationClick('Portfolio', language);
                scrollToSection('why-us');
              }}
              className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-x-1 whitespace-nowrap border border-gray-200 hover:border-transparent"
            >
              {t.portfolio}
            </button>
            
            <button
              onClick={() => {
                trackNavigationClick('About Us', language);
                scrollToSection('video-section');
              }}
              className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-x-1 whitespace-nowrap border border-gray-200 hover:border-transparent"
            >
              {t.aboutUs}
            </button>
            
            <button
              onClick={() => {
                trackCTAClick('Kontakt - Side Navigation', 'side_nav', language);
                navigate('/contact');
              }}
              className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-gray-900 border-2 border-gray-900 hover:-translate-x-1 whitespace-nowrap"
            >
              {t.contact}
            </button>
          </div>

          {/* Language Switcher - Horizontal Toggle */}
          <div className="flex gap-1 mt-2 border-2 border-gray-900 rounded-full p-1">
            <button
              onClick={() => setLanguage('sr')}
              className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                language === 'sr'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              SR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                language === 'en'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      <Hero language={language} t={t} />

      {/* Services and Pricing Section */}
      <section className="py-16 md:py-28 relative overflow-hidden" id="services">
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 via-violet-50/50 to-indigo-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-100/30 to-violet-100/40"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-violet-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-indigo-300/25 to-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-violet-100 via-indigo-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-violet-200 rounded-full mb-6 badge-reveal">
              {language === 'sr' ? '💼 O Nama' : '💼 About Us'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight section-header-reveal">
              {language === 'sr' ? 'Upoznajte ' : 'Meet '}
              <span className="gradient-text">{language === 'sr' ? 'Naš Tim' : 'Our Team'}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {language === 'sr' 
                ? 'Pogledajte video i saznajte ko stoji iza naših projekata. Strastveni smo u onome što radimo i posvećeni vašem uspehu.'
                : 'Watch the video and discover who stands behind our projects. We are passionate about what we do and dedicated to your success.'
              }
            </p>
          </div>

          {/* Video Section */}
          <div className="max-w-5xl mx-auto video-reveal" id="video-section">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <YouTubeVideo 
                videoId="Adq2OJ_F24I"
                title="Upoznajte naš tim i način rada"
                className="rounded-lg mb-6"
              />
              <div className="text-center space-y-5">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {language === 'sr' ? 'Upoznajte Nas i Naš Pristup' : 'Meet Us and Our Approach'}
                </h3>
                <button
                  onClick={() => {
                    trackCTAClick('Zakažite Besplatnu Konsultaciju', 'video_section', language);
                    navigate('/contact');
                  }}
                  className="group px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="py-16 md:py-24 max-w-6xl mx-auto relative overflow-visible">
            {/* Background Elements */}
            <div className="absolute -inset-20 pointer-events-none">
              {/* Animated circles */}
              <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-8 animate-blob blur-xl"></div>
              <div className="absolute bottom-10 right-0 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-8 animate-blob animation-delay-2000 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-5 animate-blob animation-delay-4000 blur-2xl"></div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16 relative z-10">
              <span className="px-6 py-2 bg-gradient-to-r from-violet-100 via-indigo-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-violet-200 rounded-full inline-block mb-4 badge-reveal">
                {language === 'sr' ? '👥 Naš Tim' : '👥 Our Team'}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight section-header-reveal">
                {language === 'sr' ? (
                  <>
                    Upoznajte <span className="gradient-text">Osnivače</span>
                  </>
                ) : (
                  <>
                    Meet the <span className="gradient-text">Founders</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'sr' 
                  ? 'Strastveni developeri i vizionari koji transformišu ideje u digitalna iskustva'
                  : 'Passionate developers and visionaries who transform ideas into digital experiences'
                }
              </p>
            </div>

            {/* Founders Staggered Layout */}
            <div className="space-y-12 md:space-y-16 relative z-10">
              
              {/* Founder 1 - Strahinja (Left Aligned, Wider) */}
              <div className="relative group founder-reveal founder-reveal-left w-full md:w-[75%] md:ml-0">
                {/* Background Letter "S" */}
                <div className="absolute -top-12 -left-12 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <h1 className="text-[200px] md:text-[280px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-10">
                    S
                  </h1>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* Profile Image with Gradient Border */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img 
                        src="/images/zeka.jpg"
                        alt="Strahinja - Arhitekta i osnivač AI izrada sajtova tim"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Name & Role */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                          Strahinja
                        </h3>
                        <p className="text-violet-600 font-semibold uppercase tracking-wide text-sm">
                          {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                        </p>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-4">
                        <div className="absolute -left-2 -top-2 text-3xl text-violet-300 font-serif">"</div>
                        <p className="text-gray-700 italic px-4 leading-relaxed text-base md:text-lg">
                          {language === 'sr' 
                            ? 'Inovacija i kvalitet su srž svega što radimo. Svaki projekat je prilika da premašimo očekivanja.'
                            : 'Innovation and quality are at the core of everything we do. Every project is an opportunity to exceed expectations.'
                          }
                        </p>
                        <div className="absolute -right-2 -bottom-2 text-3xl text-violet-300 font-serif">"</div>
                      </div>

                      {/* Skills/Tags */}
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-semibold rounded-full">
                          Full Stack Dev
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 text-xs font-semibold rounded-full">
                          AI Integration
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Arhitektura' : 'Architecture'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder 2 - Bogdan (Right Aligned, Wider, Offset Down) */}
              <div className="relative group founder-reveal founder-reveal-right w-full md:w-[75%] md:ml-auto md:mt-8">
                {/* Background Letter "B" */}
                <div className="absolute -top-12 -right-12 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <h1 className="text-[200px] md:text-[280px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-pink-500 to-violet-500 select-none opacity-10">
                    B
                  </h1>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8">
                    {/* Profile Image with Gradient Border */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-500 to-violet-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img 
                        src="/images/boban.jpg"
                        alt="Bogdan - CEO i programer ETF, stručnjak za AI websajt izrada"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-right">
                      {/* Name & Role */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                          Bogdan
                        </h3>
                        <p className="text-indigo-600 font-semibold uppercase tracking-wide text-sm">
                          {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                        </p>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-4">
                        <div className="absolute -left-2 -top-2 text-3xl text-indigo-300 font-serif">"</div>
                        <p className="text-gray-700 italic px-4 leading-relaxed text-base md:text-lg">
                          {language === 'sr' 
                            ? 'Sa znanjem stečenim na ETF-u i strašću prema programiranju, kreiram rešenja koja pokreću moderne digitalne projekte.'
                            : 'With knowledge gained at ETF and a passion for programming, I create solutions that power modern digital projects.'
                          }
                        </p>
                        <div className="absolute -right-2 -bottom-2 text-3xl text-indigo-300 font-serif">"</div>
                      </div>

                      {/* Skills/Tags */}
                      <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Programer (ETF)' : 'Programmer (ETF)'}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-indigo-100 text-pink-700 text-xs font-semibold rounded-full">
                          Full Stack Dev
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Softversko Inženjerstvo' : 'Software Engineering'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Services Section - Split Layout */}
          <div className="py-12 md:py-20 max-w-7xl mx-auto relative">
            {/* Smooth gradient transition to next section */}
            <div className="absolute -bottom-32 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-indigo-50/20 to-violet-50/30 pointer-events-none z-20"></div>
            {/* Animated Background Circles - Full Coverage */}
            <div className="absolute -inset-32 overflow-visible pointer-events-none">
              {/* Top Left Corner */}
              <div className="absolute -top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-15 animate-blob"></div>
              {/* Top Right Corner */}
              <div className="absolute top-10 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-12 animate-blob animation-delay-2000"></div>
              {/* Middle Left */}
              <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
              {/* Middle Right */}
              <div className="absolute top-1/2 -right-24 w-64 h-64 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full opacity-12 animate-blob animation-delay-2000"></div>
              {/* Bottom Left */}
              <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-full opacity-15 animate-blob animation-delay-4000"></div>
              {/* Bottom Right */}
              <div className="absolute -bottom-20 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-600 rounded-full opacity-10 animate-blob"></div>
              {/* Center Accents */}
              <div className="absolute top-2/3 left-1/2 w-56 h-56 bg-gradient-to-br from-violet-300 to-pink-400 rounded-full opacity-8 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-300 to-violet-400 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-16 relative z-10">
              <span className="px-6 py-2 bg-gradient-to-r from-violet-100 via-indigo-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-violet-200 rounded-full inline-block mb-4 badge-reveal">
                {language === 'sr' ? '🚀 Naše Usluge' : '🚀 Our Services'}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight section-header-reveal">
                {language === 'sr' ? (
                  <>
                    Kompletan <span className="gradient-text">Digitalni</span>
                    <br />
                    Ekosistem za Vaš Biznis
                  </>
                ) : (
                  <>
                    Complete <span className="gradient-text">Digital</span>
                    <br />
                    Ecosystem for Your Business
                  </>
                )}
              </h2>
            </div>

            {/* Service 1 - Web Dizajn (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/60 via-indigo-100/40 to-transparent rounded-[40%_60%_70%_30%_/_60%_30%_70%_40%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "W" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[60%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <h1 className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-[0.06]">
                  W
                </h1>
              </div>
              
              <div className="relative service-image-reveal service-image-left z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-400 to-indigo-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', width: '115%', marginLeft: '-15%' }}>
                  <img 
                    src="/images/dizajn.png"
                    alt="Profesionalna izrada veb sajta - Web dizajn i AI websajt izrada"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-2 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Profesionalni Web Dizajn' : 'Professional Web Design'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Kreiramo moderne, responzivne web sajtove koji ne samo da izgledaju sjajno, već i donose rezultate. Svaki dizajn je prilagođen vašem brendu i ciljevima, sa fokusom na korisničko iskustvo i konverzije.'
                    : 'We create modern, responsive websites that not only look great but also deliver results. Every design is tailored to your brand and goals, with a focus on user experience and conversions.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Responsive dizajn za sve uređaje' : 'Responsive design for all devices'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'SEO optimizacija od prvog dana' : 'SEO optimization from day one'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Brzo učitavanje i maksimalne performanse' : 'Fast loading and maximum performance'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Service 2 - Baze Podataka (Image Right) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-100/60 via-pink-100/40 to-transparent rounded-[60%_40%_30%_70%_/_40%_70%_30%_60%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "B" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[40%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <h1 className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-pink-500 to-violet-500 select-none opacity-[0.06]">
                  B
                </h1>
              </div>
              
              <div className="space-y-4 md:space-y-6 order-2 md:order-1 service-text-reveal service-delay-2 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Upravljanje Bazama Podataka' : 'Database Management'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Razvijamo i optimizujemo baze podataka za vaše poslovanje. Od analize postojećih sistema do kreiranja potpuno novih, skalabilnih rešenja koja rastu zajedno sa vašom kompanijom.'
                    : 'We develop and optimize databases for your business. From analyzing existing systems to creating completely new, scalable solutions that grow with your company.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Optimizacija postojećih baza podataka' : 'Optimization of existing databases'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Kreiranje novih, skalabilnih rešenja' : 'Creating new, scalable solutions'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Sigurnost i zaštita podataka' : 'Data security and protection'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Baze Podataka', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
              <div className="relative order-1 md:order-2 service-image-reveal service-image-right z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400 to-pink-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%', width: '85%', marginLeft: 'auto', marginRight: '0' }}>
                  <img 
                    src="/images/baza.jpg"
                    alt="Upravljanje bazama podataka za veb sajtove - AI izrada sajtova"
                    className="w-full h-[340px] md:h-[380px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-600/20"></div>
                </div>
              </div>
            </div>

            {/* Service 3 - Online Marketing (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/60 via-violet-100/40 to-transparent rounded-[70%_30%_50%_50%_/_30%_60%_40%_70%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "M" */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-[55%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <h1 className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-violet-500 to-indigo-500 select-none opacity-[0.06]">
                  M
                </h1>
              </div>
              
              <div className="relative service-image-reveal service-image-left service-delay-1 z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-pink-400 to-violet-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%', width: '95%', marginTop: '20px' }}>
                  <img 
                    src="/images/marketing.png"
                    alt="Online marketing za web sajtove - Digitalni marketing i izrada veb sajta"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-violet-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-3 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Online Marketing' : 'Online Marketing'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Dovedite pravu publiku do vašeg brenda kroz strategije digitalnog marketinga koje donose rezultate. Google Ads, društvene mreže, SEO - sve na jednom mestu za maksimalan ROI.'
                    : 'Bring the right audience to your brand through digital marketing strategies that deliver results. Google Ads, social media, SEO - everything in one place for maximum ROI.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Google Ads i Facebook kampanje' : 'Google Ads and Facebook campaigns'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Social media menadžment' : 'Social media management'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Email marketing i content kreacija' : 'Email marketing and content creation'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Online Marketing', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom gradient transition to Portfolio */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-violet-50/40 to-violet-50/60 pointer-events-none z-10"></div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 md:py-32 relative overflow-hidden" id="why-us">
        {/* Top gradient transition from Services */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-50/60 via-violet-50/30 to-transparent pointer-events-none z-10"></div>
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-indigo-50/30 to-pink-50/25"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-50/15 to-indigo-50/20"></div>
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-violet-500 rounded-full opacity-5 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <div className="inline-block mb-6">
              <span className="px-6 py-2 bg-gradient-to-r from-violet-100 via-indigo-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-violet-200 rounded-full badge-reveal">
                {language === 'sr' ? '✨ Naši Projekti' : '✨ Our Projects'}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 section-header-reveal leading-tight">
              {language === 'sr' ? (
                <>
                  Izuzetni <span className="gradient-text">Rezultati</span>
                  <br />
                  za Izuzetne Brendove
                </>
              ) : (
                <>
                  Exceptional <span className="gradient-text">Results</span>
                  <br />
                  for Exceptional Brands
                </>
              )}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto section-header-reveal">
              {language === 'sr' 
                ? 'Svaki projekat je priča o uspehu. Od ideje do realizacije, stvaramo digitalna iskustva koja inspirišu i pretvaraju posetiоce u klijente.'
                : 'Every project is a success story. From concept to completion, we create digital experiences that inspire and convert visitors into customers.'
              }
            </p>
          </div>

          {/* Smooth transition to Contact section */}
          <div className="absolute -bottom-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-indigo-50/20 to-violet-50/40 pointer-events-none z-0"></div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto relative z-10">
            <div className="portfolio-card-reveal portfolio-card-delay-1">
              <PortfolioCard
                title="Kralj Residence"
                description={language === 'sr' ? "Moderan web sajt za apartmane i hotele" : "Modern website for apartments and hotels"}
                image="https://res.cloudinary.com/dij7ynio3/image/upload/v1739663014/kralj12_um1xrk.png"
                tags={language === 'sr' ? ["Web Sajt", "Responzivan"] : ["Website", "Responsive"]}
                link="https://kraljresidence.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-2">
              <PortfolioCard
                title="BN Autofolije"
                description={language === 'sr' ? "Profesionalni web sajt za auto folije i detailing" : "Professional website for car wraps and detailing"}
                image="https://res.cloudinary.com/dij7ynio3/image/upload/v1740502433/pozadina-min_gfbxfp.png"
                tags={language === 'sr' ? ["Web Sajt", "Auto Detailing", "SEO"] : ["Website", "Auto Detailing", "SEO"]}
                link="https://bnautofolije.com/"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-3">
              <PortfolioCard
                title="Prestige Gradnja"
                description={language === 'sr' ? "Moderan web sajt za nekretnine i apartmane" : "Modern website for real estate and apartments"}
                image="https://aislike.rs/aisajt/prestige-min.png"
                tags={language === 'sr' ? ["Web Sajt"] : ["Website"]}
                link="https://prestigegradnja.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-4">
              <PortfolioCard
                title="Custom RC Parts"
                description={language === 'sr' ? "Ecommerce web sajt" : "Ecommerce website"}
                image="https://aislike.rs/aisajt/rc-min.png"
                tags={["E-commerce", language === 'sr' ? "Web Shop" : "Online Store"]}
                link="https://customrc.parts"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-5">
              <PortfolioCard
                title="White Club"
                description={language === 'sr' ? "Online rezervacije" : "Online reservations"}
                image="https://aislike.rs/aisajt/white-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Rezervacije"] : ["Website", "Reservations"]}
                link="https://whiteclub.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-6">
              <PortfolioCard
                title="Pokloni Portret"
                description={language === 'sr' ? "Personalizovani portreti kao poklon" : "Personalized portraits as gifts"}
                image="https://aislike.rs/aisajt/pokloniportret-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Umetnost"] : ["Website", "Art"]}
                link="https://pokloniportret.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-7">
              <PortfolioCard
                title="IN-STAN"
                description={language === 'sr' ? "Stolarija i nameštaj po meri" : "Custom carpentry and furniture"}
                image="https://aislike.rs/aisajt/instan-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Stolarija"] : ["Website", "Carpentry"]}
                link="https://in-stan.rs"
              />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 md:mt-20 scroll-fade-in">
            <p className="text-gray-600 mb-6 text-lg">
              {language === 'sr' 
                ? 'Spremni da postanete sledeća priča uspeha?' 
                : 'Ready to become the next success story?'
              }
            </p>
            <button
              onClick={() => {
                trackCTAClick('Razgovarajmo o Vašem Projektu', 'portfolio_section', language);
                navigate('/contact');
              }}
              className="group px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              {language === 'sr' ? 'Razgovarajmo o Vašem Projektu' : "Let's Talk About Your Project"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-gray-900 py-12 md:py-16 border-t border-violet-200/30">
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-violet-50/35 to-pink-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/20 via-transparent to-indigo-50/25"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link 
                to="/"
                className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
              >
                <img 
                  src="/images/providna2.png" 
                  alt="AiSajt Logo" 
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="text-gray-600">
                {t.footerDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.services}</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Web Dizajn' : 'Web Design'}>{language === 'sr' ? 'Web Dizajn' : 'Web Design'}</a></li>
                <li><a href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Baze Podataka' : 'Database Management'}>{language === 'sr' ? 'Baze Podataka' : 'Database Management'}</a></li>
                <li><a href="#services" className="text-gray-600 hover:text-pink-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Online Marketing' : 'Online Marketing'}>{language === 'sr' ? 'Online Marketing' : 'Online Marketing'}</a></li>
                <li><a href="#services" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={language === 'sr' ? 'E-commerce' : 'E-commerce'}>{language === 'sr' ? 'E-commerce' : 'E-commerce'}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.company}</h4>
              <ul className="space-y-2">
                <li><a href="#video-section" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={t.aboutUs}>{t.aboutUs}</a></li>
                <li><a href="#why-us" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300" aria-label={t.portfolio}>{t.portfolio}</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-pink-600 transition-colors duration-300" aria-label={t.contact}>{t.contact}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-600" aria-hidden="true" />
                  <a 
                    href="mailto:office@aisajt.com"
                    onClick={() => trackContactInfoClick('email', 'office@aisajt.com', language)}
                    className="text-gray-600 hover:text-violet-600 transition-colors duration-300"
                    aria-label="Pošaljite email na office@aisajt.com"
                  >
                    office@aisajt.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <a 
                    href="tel:+381613091583"
                    onClick={() => trackContactInfoClick('phone', '+381613091583', language)}
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                    aria-label="Pozovite na broj +381 61 3091583"
                  >
                    +381 61 3091583
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-600" aria-hidden="true" />
                  <span className="text-gray-600">{language === 'sr' ? 'Beograd, Srbija' : 'Belgrade, Serbia'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-violet-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} AiSajt.com | {language === 'sr' ? 'Profesionalna izrada web sajtova' : 'Professional web development'}
              </p>
              <div className="flex gap-6">
                <Link 
                  to="/privacy" 
                  className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label={language === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
                >
                  {language === 'sr' ? 'Privatnost' : 'Privacy'}
                </Link>
                <Link 
                  to="/terms" 
                  className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label={language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                >
                  {language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

