import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always true as these are essential
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Add a small delay for a smoother entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (settings: CookieSettings) => {
    localStorage.setItem('cookieConsent', JSON.stringify(settings));
    // Here you would typically initialize your analytics/marketing tools based on consent
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const handleDeclineAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimalConsent);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-black/95 backdrop-blur-lg border-t border-[#D4AF37]/20 transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        animation: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-cream-100/90 text-sm md:text-base leading-relaxed pr-4">
            Ovaj sajt koristi kolačiće za bolje korisničko iskustvo i analitiku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleDeclineAll}
              className="relative overflow-hidden group flex items-center justify-center px-4 py-2 border border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37]/40 text-[#D4AF37] text-sm transition-all duration-500 hover:scale-105"
            >
              <X className="w-4 h-4 mr-2" />
              Odbij sve
            </button>
            <button
              onClick={handleAcceptAll}
              className="relative overflow-hidden group flex items-center justify-center px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#E5C048] text-sm transition-all duration-500 hover:scale-105"
            >
              <Check className="w-4 h-4 mr-2" />
              Prihvati sve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;