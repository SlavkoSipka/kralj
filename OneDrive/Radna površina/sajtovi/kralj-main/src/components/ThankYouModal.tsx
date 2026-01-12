import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, autoCloseDelay = 2000 }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
      style={{
        animation: 'fadeInBackdrop 500ms ease-out forwards'
      }}
    >
      {/* Modal Content - Full Screen sa animacijom širenja */}
      <div 
        className="relative w-full h-full max-w-[90vw] max-h-[90vh] bg-[#1A1614] rounded-xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'expandFromCenter 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transformOrigin: 'center' // Centar animacije
        }}
      >
        <div className="p-8 text-center w-full max-w-md">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>

          {/* Logo */}
          <img 
            src="https://res.cloudinary.com/duvwf75cx/image/upload/v1739196547/Beli_logo2_w2niz5.png"
            alt="Kralj Residence Logo"
            className="h-16 mx-auto mb-6"
          />

          {/* Message */}
          <h3 
            className="text-2xl text-[#D4AF37] mb-4"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Hvala na poruci!
          </h3>
          <p className="text-cream-100/80 mb-8">
            Vaša poruka je uspešno poslata. Naš tim će vas kontaktirati u najkraćem mogućem roku.
          </p>
        </div>
      </div>
    </div>
  );
};

// CSS animacije (pretpostavljam da koristiš globalni CSS fajl ili Tailwind sa @keyframes)
const styles = `
  @keyframes fadeInBackdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.9;
    }
  }

  @keyframes expandFromCenter {
    from {
      transform: scale(0); /* Počinje kao tačka u centru */
      opacity: 0;
    }
    to {
      transform: scale(1); /* Raste do punih 100% veličine */
      opacity: 1;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ThankYouModal;