import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language, Translation } from '../../types/language';

interface HeroProps {
  language: Language;
  t: Translation;
}

export function Hero({ language, t }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    if (heroRef.current) {
      observerRef.current.observe(heroRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header 
      ref={heroRef}
      className="text-gray-900 relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen flex items-center">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-pink-50/40"></div>
      {/* Animated background circles - PopArt style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large violet circle */}
        <div className={`absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-20 transition-all duration-[2000ms] ${isVisible ? 'scale-100 translate-x-0 translate-y-0' : 'scale-50 -translate-x-20 -translate-y-20'}`}></div>
        
        {/* Indigo circle - right */}
        <div className={`absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-15 transition-all duration-[2500ms] delay-300 ${isVisible ? 'scale-100 translate-x-0' : 'scale-50 translate-x-32'}`}></div>
        
        {/* Pink circle - bottom left */}
        <div className={`absolute -bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20 transition-all duration-[2200ms] delay-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'}`}></div>
        
        {/* Small violet accent */}
        <div className={`absolute top-1/2 left-1/3 w-40 h-40 bg-violet-500 rounded-full opacity-10 transition-all duration-[1800ms] delay-200 ${isVisible ? 'scale-100' : 'scale-0'}`}></div>
        
        {/* Small indigo accent */}
        <div className={`absolute bottom-1/3 right-1/4 w-32 h-32 bg-indigo-500 rounded-full opacity-15 transition-all duration-[2000ms] delay-700 ${isVisible ? 'scale-100' : 'scale-0'}`}></div>
      </div>
      
      {/* Giant Background Letter "A" - Behind Text */}
      <div className="absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
        <div className={`transform transition-all duration-[2000ms] ${isVisible ? 'translate-x-0 opacity-30 md:opacity-25 scale-100' : '-translate-x-20 opacity-0 scale-90'}`}>
          <h1 className="text-[200px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none">
            A
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Breadcrumb */}
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                {language === 'sr' ? 'Početna' : 'Home'} / {language === 'sr' ? 'AI Web Dizajn' : 'AI Web Design'}
              </p>
            </div>

            {/* Main Heading */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6 drop-shadow-sm">
                {language === 'sr' ? (
                  <>
                    Profesionalna Izrada <br />
                    <span className="gradient-text drop-shadow-md">AI Web Sajtova</span>
                  </>
                ) : (
                  <>
                    Professional <br />
                    <span className="gradient-text drop-shadow-md">AI Web Development</span>
                  </>
                )}
              </h1>
            </div>

            {/* Description */}
            <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl font-normal">
                {language === 'sr' 
                  ? 'Kompletne usluge izrade web sajtova za online prisustvo koje vaš brend zaslužuje. Otkrijte moć prilagođenog, optimizovanog dizajna uz najnoviju AI tehnologiju.'
                  : 'Complete website development services for the online presence your brand deserves. Discover the power of custom-made, optimized design with cutting-edge AI technology.'
                }
              </p>
            </div>

            {/* Buttons - PopArt Style */}
            <div className={`flex flex-wrap gap-4 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button
                onClick={() => scrollToSection('why-us')}
                className="group px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                {language === 'sr' ? 'PORTFOLIO' : 'PORTFOLIO'}
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
              
              <Link
                to="/contact"
                className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2"
              >
                {language === 'sr' ? 'NARUČITE' : 'ORDER'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Right Side - 3D Mockups & Logo */}
          <div className="relative hidden lg:block">
            <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-90'}`}>
              {/* Logo Image with 3D effect */}
              <div className="relative">
                <img 
                  src="/images/aisajt.png" 
                  alt="AI izrada sajtova - Profesionalna izrada veb sajta sa veštačkom inteligencijom"
                  className="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
                />
                
                {/* Floating devices mockup simulation */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl shadow-2xl transform rotate-12 transition-transform duration-700 hover:rotate-6">
                  <div className="absolute inset-4 bg-white rounded-2xl flex items-center justify-center">
                    <img 
                      src="/images/aisajt close up.png" 
                      alt="AI websajt izrada - Logo"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>

                {/* Contact card mockup */}
                <div className="absolute top-10 -left-16 w-56 h-32 bg-gradient-to-br from-pink-50 to-violet-50 rounded-2xl shadow-xl transform -rotate-6 transition-transform duration-700 hover:rotate-0 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contact</h3>
                  <p className="text-sm text-gray-600">office@aisajt.com</p>
                  <p className="text-sm text-gray-600">+381 61 3091583</p>
                </div>

                {/* Feature tag */}
                <div className="absolute -top-8 right-20 bg-gradient-to-r from-violet-600 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm animate-bounce-slow">
                  {language === 'sr' ? 'Nove Funkcije' : 'New Features'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Smooth gradient transition to Services section */}
      <div className="absolute -bottom-20 left-0 right-0 h-32 z-[5] bg-gradient-to-b from-transparent via-pink-50/30 to-violet-50/40 pointer-events-none"></div>
    </header>
  );
}