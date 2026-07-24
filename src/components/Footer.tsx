import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Lock } from 'lucide-react';
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

  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-night text-cream-100">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src="/images/Beli logo2.webp" alt="Kralj Residence" className="mb-6 h-14" />
            <p className="max-w-md text-ts-p leading-relaxed text-cream-100/70">
              Kralj Residence je porodična firma porodice Zekanović. Već decenijama gradimo i prodajemo
              luksuzne stanove i vile u Vrnjačkoj Banji, uz direktnu prodaju od investitora.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="https://www.facebook.com/kraljresidence" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-btn">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/kralj_residence?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-btn">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="footer-heading">Navigacija</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/"
                  onClick={() => location.pathname === '/' && window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="footer-link"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/properties" onClick={() => window.scrollTo(0, 0)} className="footer-link">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/location" onClick={() => window.scrollTo(0, 0)} className="footer-link">
                  {t('nav.location')}
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="footer-link">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="footer-link">
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="footer-heading">Kontakt</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+381606112327" className="footer-link flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <span className="font-sans tabular-nums">+381 60 611 2327</span>
                </a>
              </li>
              <li>
                <a href="tel:+381606112328" className="footer-link flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <span className="font-sans tabular-nums">+381 60 611 2328</span>
                </a>
              </li>
              <li>
                <a href="mailto:office@kraljresidence.rs" className="footer-link flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold" />
                  office@kraljresidence.rs
                </a>
              </li>
              <li className="flex items-start gap-3 text-cream-100/70">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gold" />
                Kneza Miloša 6, Vrnjačka Banja, Srbija
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-cream-100/50">
            © {year} Kralj Residence. Sva prava zadržana.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/o-projektu" onClick={() => window.scrollTo(0, 0)} className="footer-link">
              O projektu
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-cream-100/40 transition-colors hover:text-gold"
            >
              <Lock className="h-3 w-3" />
              Admin
            </Link>
            <span className="text-cream-100/50">
              Izrada sajta:{' '}
              <a href="https://aisajt.com" className="text-gold transition-colors hover:text-gold-soft">
                AiSajt
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;