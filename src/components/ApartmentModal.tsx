import { memo, useEffect, useCallback, type MouseEvent } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Apartment } from '../types';
import { ANIMATION_DELAYS, DEFAULT_APARTMENT_DESCRIPTION } from '../constants';

interface ApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
  /** Naziv objekta (za dinamičke zgrade iz baze); ako izostane, izvodi se iz rute. */
  objectName?: string;
  /** Labela spoljnog prostora ("Terasa" / "Dvorište"); ako izostane, izvodi se iz rute. */
  outdoorLabel?: string;
  /** Opis stana; ako izostane, koristi se podrazumevani tekst. */
  descriptionText?: string;
  /** Vrednost spoljnog prostora (npr. "2.32 m²" ili "Ne"); ako izostane, izvodi se iz hasBalcony. */
  outdoorValue?: string;
}

const ApartmentModal = memo(({ isOpen, onClose, apartment, objectName: objectNameProp, outdoorLabel, descriptionText, outdoorValue }: ApartmentModalProps) => {
  const location = useLocation();
  const isVilla4 = location.pathname === '/villa-4';
  const isRoyal = location.pathname === '/royal-aqua';
  const objectName = objectNameProp ?? (isRoyal ? 'Royal Aqua' : isVilla4 ? 'Vila IV' : 'Vila III');
  const areaLabel =
    outdoorLabel ?? (isRoyal && [1, 2, 3, 4, 5, 6, 10, 11].includes(apartment.number) ? 'Dvorište' : 'Terasa');
  const sold = apartment.status === 'Prodato';

  const handleBodyScroll = useCallback(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
    return () => {};
  }, [isOpen]);

  useEffect(() => handleBodyScroll(), [handleBodyScroll]);

  if (!isOpen) return null;

  const handleContentClick = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[100] mt-16 flex items-center justify-center p-2 sm:p-4 md:mt-20 md:p-8" onClick={onClose}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-night/85 backdrop-blur-sm"
        style={{ animation: isOpen ? `fadeIn ${ANIMATION_DELAYS.FADE}ms ease-out forwards` : 'none' }}
      />

      {/* Modal */}
      <div
        className="relative my-2 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl2 border border-gold/20 bg-royal-ivory shadow-2xl md:my-0"
        onClick={handleContentClick}
        style={{ animation: isOpen ? `modalSlideUp ${ANIMATION_DELAYS.MODAL_SLIDE}ms cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none' }}
      >
        {/* Close (sticky — always visible while scrolling) */}
        <div className="pointer-events-none sticky top-0 z-20 flex h-0 justify-end">
          <button
            onClick={onClose}
            className="pointer-events-auto mr-3 mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-night/90 text-gold shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-night"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-4 pt-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
          {/* Image */}
          <div className="order-1 md:order-none">
            <div className="relative h-full overflow-hidden rounded-xl border border-royal-ink/10 bg-royal-sand">
              <img
                src={apartment.image}
                alt={`${apartment.name} — tlocrt`}
                className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Details */}
          <div className="order-2 flex flex-col md:order-none">
            <span className="eyebrow">{objectName}</span>
            <h2 className="heading mt-4 text-ts-h4 text-royal-ink md:text-ts-h3" style={{ fontFamily: 'Playfair Display' }}>
              {apartment.name}
            </h2>
            <div className="mt-4">
              <span className={`chip-status ${sold ? 'chip-sold' : 'chip-available'}`}>{apartment.status}</span>
            </div>

            {/* Features */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ['Površina', typeof apartment.size === 'string' ? apartment.size : `${apartment.size} m²`],
                ['Objekat', objectName],
                ['Sprat', apartment.floor],
                [areaLabel, outdoorValue ?? (apartment.hasBalcony ? 'Da' : 'Ne')],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-royal-ink/[0.05] p-4">
                  <p className="text-xs uppercase tracking-wider text-gold-deep">{label}</p>
                  <p className="mt-1 text-ts-h6 font-medium text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-7">
              <h3 className="heading text-ts-h6 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                O stanu
              </h3>
              <p className="mt-3 text-ts-p leading-relaxed text-royal-stone">
                {descriptionText || DEFAULT_APARTMENT_DESCRIPTION}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                onClose();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const viewportHeight = window.innerHeight;
                  const { top } = contactSection.getBoundingClientRect();
                  const offset = top + window.scrollY - viewportHeight * 0.15;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                }
              }}
              className="btn-royal mt-8 w-full"
            >
              Kontaktirajte nas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ApartmentModal.displayName = 'ApartmentModal';

export default ApartmentModal;
