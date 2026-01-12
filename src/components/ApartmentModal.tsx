import { memo, useEffect, useCallback, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Apartment } from '../types';
import { ANIMATION_DELAYS } from '../constants';

interface ApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
}

const ApartmentModal = memo(({ isOpen, onClose, apartment }: ApartmentModalProps) => {
  const location = useLocation();
  const isVilla4 = location.pathname === '/villa-4';

  const handleBodyScroll = useCallback(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => document.body.style.overflow = 'unset';
    }
    return () => {};
  }, [isOpen]);

  useEffect(() => {
    return handleBodyScroll();
  }, [handleBodyScroll]);

  if (!isOpen) return null;

  const handleContentClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 mt-16 md:mt-20"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        style={{
          animation: isOpen ? `fadeIn ${ANIMATION_DELAYS.FADE}ms ease-out forwards` : 'none'
        }}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl bg-[#F5E6D3] rounded-xl overflow-hidden shadow-2xl my-2 md:my-0 max-h-[90vh] overflow-y-auto"
        onClick={handleContentClick}
        style={{
          animation: isOpen ? `modalSlideUp ${ANIMATION_DELAYS.MODAL_SLIDE}ms cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1A1614]/90 text-[#D4AF37] hover:bg-[#1A1614] transition-all duration-300 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
          {/* Images Section */}
          <div className="order-1 md:order-none">
            <div className="relative overflow-hidden rounded-lg bg-[#1A1614]/10 h-full">
              <img
                src={apartment.image}
                alt={`${apartment.name} - Tlocrt`}
                className="w-full h-full transform hover:scale-110 transition-transform duration-700 object-contain"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6 md:space-y-8 order-2 md:order-none">
            <div>
              <h2 
                className="text-2xl md:text-3xl text-[#1A1614] mb-4"
              >
                {apartment.name}
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#1A1614] text-[#D4AF37] font-medium">
                {apartment.status}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-[#1A1614]/10 rounded-lg">
                <p className="text-[#1A1614] text-sm mb-1 font-medium">Površina</p>
                <p className="text-[#1A1614] text-xl md:text-2xl font-medium font-serif">
                  {typeof apartment.size === 'string' ? apartment.size : `${apartment.size}m²`}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#1A1614]/10 rounded-lg">
                <p className="text-[#1A1614] text-sm mb-1 font-medium">Objekat</p>
                <p className="text-[#1A1614] text-xl md:text-2xl font-medium font-serif">
                  {location.pathname === '/royal-aqua' ? 'Royal Aqua' : isVilla4 ? 'Vila IV' : 'Vila III'}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#1A1614]/10 rounded-lg">
                <p className="text-[#1A1614] text-sm mb-1 font-medium">Sprat</p>
                <p className="text-[#1A1614] text-xl md:text-2xl font-medium font-serif">
                  {apartment.floor}
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#1A1614]/10 rounded-lg">
                <p className="text-[#1A1614] text-sm mb-1 font-medium">{location.pathname === '/royal-aqua' && [1, 2, 3, 4, 5, 6, 10, 11].includes(apartment.number) ? 'Dvorište' : 'Terasa'}</p>
                <p className="text-[#1A1614] text-xl md:text-2xl font-medium font-serif">
                  {apartment.hasBalcony ? 'Da' : 'Ne'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert">
              <h3 className="text-[#1A1614] text-lg md:text-xl mb-3 md:mb-4 font-serif">
                O stanu
              </h3>
              <p className="text-[#1A1614]/80 leading-relaxed text-sm">
                Ovaj prekrasan stan u Kralj Residence nudi savršen spoj funkcionalnosti i luksuza. 
                Sa pažljivo osmišljenim rasporedom i kvalitetnim materijalima, predstavlja idealan izbor za vrhunski životni prostor.
              </p>
            </div>

            {/* Contact Button */}
            <button 
              onClick={() => {
                onClose();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const viewportHeight = window.innerHeight;
                  const { top } = contactSection.getBoundingClientRect();
                  const sectionTop = top + window.scrollY;
                  const offset = sectionTop - (viewportHeight * 0.2);
                  
                  window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                  });
                }
              }}
              className="w-full relative overflow-hidden bg-[#1A1614] text-[#D4AF37] px-4 md:px-6 py-3 md:py-4 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1A1614]/90 group"
            >
              <span className="relative z-10 flex items-center justify-center text-base md:text-lg">
                Kontaktirajte nas
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ApartmentModal.displayName = 'ApartmentModal';

export default ApartmentModal;