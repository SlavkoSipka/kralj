import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = ({ scrolled = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when navigation occurs
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const viewportHeight = window.innerHeight;
          const { top } = section.getBoundingClientRect();
          const sectionTop = top + window.scrollY;
          const offset = sectionTop - (viewportHeight * 0.2); // Position at 20% from top
          
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
          
          const root = document.documentElement;
          root.style.scrollBehavior = 'smooth';
          setTimeout(() => {
            root.style.scrollBehavior = '';
          }, 2000);
        }
      }, 2000);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      const viewportHeight = window.innerHeight;
      const { top } = section.getBoundingClientRect();
      const sectionTop = top + window.scrollY;
      const offset = sectionTop - (viewportHeight * 0.2); // Position at 20% from top
      
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  }, [location.pathname, navigate]);

  return (
    <div className={`fixed w-full top-0 left-0 z-[99] transition-all duration-500 ${scrolled ? 'h-16 md:h-20 bg-black/80 backdrop-blur-sm' : 'h-24 md:h-32 bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="container-fluid px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-2">
            <Link to="/">
              <img 
                src="http://aislike.rs/Kralj1/Beli logo2.png" 
                alt="Kralj Residence Logo" 
                className={`transition-all duration-500 transform ${scrolled ? 'h-10 md:h-14' : 'h-16 md:h-24'}`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center -mr-2">
            <nav className="flex items-center space-x-8">
              <Link 
                to="/"
                onClick={() => {
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="text-white hover:text-[#D4AF37] transition-colors duration-300 text-sm uppercase tracking-wider font-light h-8 flex items-center"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/location"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#D4AF37] transition-colors duration-300 text-sm uppercase tracking-wider font-light h-8 flex items-center"
              >
                {t('nav.location')}
              </Link>
              {[
                { name: t('nav.about'), id: 'about' },
                { name: t('nav.contact'), id: 'contact' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-[#D4AF37] transition-colors duration-300 text-sm uppercase tracking-wider font-light h-8 flex items-center"
                >
                  {item.name}
                </button>
              ))}
              <div className="relative" ref={dropdownRef}>
                <Link 
                  to="/properties"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative overflow-hidden group flex items-center h-8 z-20"
                >
                  <span className="relative z-10 inline-flex items-center justify-center text-sm uppercase tracking-wider font-light px-6 h-full border border-[#D4AF37] text-[#D4AF37] transition-colors duration-300 group-hover:text-black">
                    {t('nav.properties')}
                  </span>
                  <div className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-300 ease-out group-hover:w-full"></div>
                </Link>
              </div>
            </nav>

            {/* Contact Info */}
            <div className="ml-8 pl-8 border-l border-white/20 flex items-center space-x-6">
              <div className="flex flex-col space-y-1">
                <a href="tel:+381606112327" className="flex items-center text-white hover:text-[#D4AF37] transition-colors duration-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">+381 60 611 2327</span>
                </a>
                <a href="tel:+381606112328" className="flex items-center text-white hover:text-[#D4AF37] transition-colors duration-300">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">+381 60 611 2328</span>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setLanguage('sr')}
                  className={`text-sm ${language === 'sr' ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'} transition-colors duration-300`}
                >
                  SR
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-sm ${language === 'en' ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'} transition-colors duration-300`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              to="/"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setIsMenuOpen(false);
              }}
              className="block text-white hover:text-[#D4AF37] py-2 transition"
            >
              Početna
            </Link>
            <Link
              to="/location"
              onClick={() => {
                window.scrollTo(0, 0);
                setIsMenuOpen(false);
              }}
              className="block text-white hover:text-[#D4AF37] py-2 transition"
            >
              Lokacija
            </Link>
            {[
              { name: 'O nama', id: 'about' },
              { name: 'Kontakt', id: 'contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="block text-white hover:text-[#D4AF37] py-2 transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
            <div className="mt-4 space-y-2">
              <Link 
                to="/properties"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[#D4AF37] border border-[#D4AF37] py-2 text-center hover:bg-[#D4AF37] hover:text-black transition-colors duration-300"
              >
                {t('hero.resort')}
              </Link>
              <Link 
                to="/properties"
                onClick={() => setIsMenuOpen(false)}
                className="block text-[#D4AF37] border border-[#D4AF37] py-2 text-center hover:bg-[#D4AF37] hover:text-black transition-colors duration-300"
              >
                {t('hero.aqua')}
              </Link>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="space-y-2">
                <a href="tel:+381606112327" className="flex items-center text-white hover:text-[#D4AF37] py-2 transition">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+381 60 611 2327</span>
                </a>
                <a href="tel:+381606112328" className="flex items-center text-white hover:text-[#D4AF37] py-2 transition">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+381 60 611 2328</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;