import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PHONES = [
  { label: '+381 60 611 2327', href: 'tel:+381606112327' },
  { label: '+381 60 611 2328', href: 'tel:+381606112328' },
];

const Navigation = ({ scrolled = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setIsMenuOpen(false);

      const doScroll = () => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        const offset = section.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.15;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      };

      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(doScroll, 400);
      } else {
        doScroll();
      }
    },
    [location.pathname, navigate]
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 z-[99] w-full transition-all duration-500 ${
        scrolled ? 'h-16 md:h-20' : 'h-24 md:h-32'
      } ${
        scrolled || isMenuOpen
          ? 'bg-night/95 shadow-royal-sm backdrop-blur-md'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container-fluid h-full px-6 md:px-10">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Kralj Residence — početna">
            <img
              src="/images/Beli logo2.webp"
              alt="Kralj Residence"
              className={`transition-all duration-500 ${scrolled ? 'h-10 md:h-14' : 'h-16 md:h-24'}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center md:flex">
            <nav className="flex items-center gap-8">
              <Link to="/" className={`nav-link ${isActive('/') ? 'is-active' : ''}`}>
                {t('nav.home')}
              </Link>
              <Link to="/location" className={`nav-link ${isActive('/location') ? 'is-active' : ''}`}>
                {t('nav.location')}
              </Link>
              <a href="/#about" onClick={(e) => scrollToSection(e, 'about')} className="nav-link">
                {t('nav.about')}
              </a>
              <a href="/#contact" onClick={(e) => scrollToSection(e, 'contact')} className="nav-link">
                {t('nav.contact')}
              </a>
              <Link
                to="/properties"
                className={`rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] shadow-royal-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-royal ${
                  isActive('/properties')
                    ? 'bg-gold text-night ring-2 ring-gold/40 ring-offset-2 ring-offset-transparent'
                    : 'bg-gradient-to-br from-gold to-gold-deep text-night hover:from-gold-soft hover:to-gold'
                }`}
              >
                {t('nav.properties')}
              </Link>
            </nav>

            {/* Contact Info */}
            <div className="ml-8 flex items-center gap-6 border-l border-white/15 pl-8">
              <div className="flex flex-col gap-1">
                {PHONES.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="flex items-center text-white/90 transition-colors duration-300 hover:text-gold"
                  >
                    <Phone className="mr-2 h-3.5 w-3.5" />
                    <span className="font-sans text-sm tabular-nums tracking-wide">{p.label}</span>
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button
                  onClick={() => setLanguage('sr')}
                  className={language === 'sr' ? 'text-gold' : 'text-white/70 transition-colors hover:text-gold'}
                >
                  SR
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'text-gold' : 'text-white/70 transition-colors hover:text-gold'}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Meni"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-gold/25 bg-night shadow-2xl md:hidden"
        >
          <nav className="px-6 py-5">
            <div className="flex flex-col divide-y divide-white/10">
              {[
                { label: t('nav.home'), to: '/' },
                { label: t('nav.location'), to: '/location' },
                { label: t('nav.about'), section: 'about' },
                { label: t('nav.contact'), section: 'contact' },
              ].map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between py-4 text-lg tracking-wide transition-colors ${
                      isActive(item.to) ? 'text-gold' : 'text-white/90 hover:text-gold'
                    }`}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-gold/60" />
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={`/#${item.section}`}
                    onClick={(e) => scrollToSection(e, item.section!)}
                    className="flex items-center justify-between py-4 text-lg tracking-wide text-white/90 transition-colors hover:text-gold"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-gold/60" />
                  </a>
                )
              )}
            </div>

            <Link
              to="/properties"
              onClick={() => setIsMenuOpen(false)}
              className="mt-5 block rounded-full bg-gradient-to-br from-gold to-gold-deep py-3.5 text-center font-semibold uppercase tracking-[0.12em] text-night shadow-royal-sm transition-all duration-300 hover:from-gold-soft hover:to-gold"
            >
              {t('nav.properties')}
            </Link>

            <div className="mt-6 rounded-xl2 border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Pozovite nas</p>
              <div className="space-y-3">
                {PHONES.map((p) => (
                  <a key={p.href} href={p.href} className="flex items-center gap-3 text-white/90 transition-colors hover:text-gold">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="font-sans text-base tabular-nums tracking-wide">{p.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-sm">
              <button
                onClick={() => setLanguage('sr')}
                className={language === 'sr' ? 'font-semibold text-gold' : 'text-white/60 transition-colors hover:text-gold'}
              >
                SR
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'font-semibold text-gold' : 'text-white/60 transition-colors hover:text-gold'}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navigation;
