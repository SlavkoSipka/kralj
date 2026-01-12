import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigateAndScroll = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete and DOM to update
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const viewportHeight = window.innerHeight;
          const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
          const offset = sectionTop - (viewportHeight * 0.2);
          
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        }
      }, 2000); // Increased timeout to ensure page loads completely
      return;
    }

    // If already on home page, just scroll
    const section = document.getElementById(sectionId);
    if (section) {
      const viewportHeight = window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      const offset = sectionTop - (viewportHeight * 0.2);
      
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    navigateAndScroll(sectionId);
  };

  return (
    <footer className="bg-black relative">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <img 
              src="http://aislike.rs/Kralj1/Beli logo2.png"
              alt="Kralj Residence Logo"
              className="h-16 mb-6"
            />
            <p className="text-cream-100/80 leading-relaxed mb-8 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/kraljresidence" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/kralj_residence?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#D4AF37] text-lg mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  onClick={() => {
                    if (location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-cream-100/80 hover:text-[#D4AF37] transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-cream-100/80 hover:text-[#D4AF37] transition-colors"
                >
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScroll('about')}
                  className="text-cream-100/80 hover:text-[#D4AF37] transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateAndScroll('contact')}
                  className="text-cream-100/80 hover:text-[#D4AF37] transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#D4AF37] text-lg mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+381606112327" className="text-cream-100/80 hover:text-[#D4AF37] transition-colors flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +381 60 611 2327
                </a>
              </li>
              <li>
                <a href="mailto:office@kraljresidence.rs" className="text-cream-100/80 hover:text-[#D4AF37] transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  office@kraljresidence.rs
                </a>
              </li>
              <li>
                <div className="text-cream-100/80 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Vrnjačka Banja, Srbija
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cream-100/60 text-sm mb-4 md:mb-0">
              {t('footer.rights')}
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-cream-100/60 text-sm">
                Website by <a href="https://aisajt.com" className="text-[#D4AF37] hover:text-white transition-colors">
                  AiSajt
                </a>
              </p>
              <Link 
                to="/o-projektu" 
                onClick={() => window.scrollTo(0, 0)}
                className="text-cream-100/60 hover:text-[#D4AF37] text-sm transition-colors"
              >
                O projektu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;