import React from 'react';
import { X } from 'lucide-react';

interface ResortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResortModal: React.FC<ResortModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8"
      onClick={onClose}
      style={{ marginTop: '0' }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        style={{
          animation: 'fadeIn 500ms ease-out forwards'
        }}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full h-full md:h-auto md:max-w-5xl bg-[#F5E6D3] rounded-none md:rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'modalSlideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed md:absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1A1614]/90 text-[#D4AF37] hover:bg-[#1A1614] transition-all duration-300 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:grid md:grid-cols-2 h-full md:h-auto">
          {/* Image Section */}
          <div className="relative h-[40vh] md:h-auto overflow-hidden">
            <img 
              src="http://aislike.rs/Kralj1/Kralj 1.png"
              alt="Kralj Residence Resort"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/50 to-transparent" />
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 md:pr-12 overflow-y-auto flex-1">
            <div className="space-y-6">
              <h2 
                className="text-2xl md:text-3xl text-[#1A1614] mb-4 md:mb-6"
                style={{ fontFamily: 'Playfair Display' }}
              >
                Kralj Residence Resort – Oaza mira u srcu Vrnjačke Banje
              </h2>

              <p className="text-[#1A1614]/80 leading-relaxed text-sm md:text-base">
                Kralj Residence Resort je luksuzni kompleks koji pruža savršen spoj komfora, privatnosti i prirodne lepote. 
                Sa četiri ekskluzivne vile, resort je idealno mesto za one koji traže luksuzno stanovanje u harmoniji sa prirodom.
              </p>

              <div>
                <h3 
                  className="text-lg md:text-xl text-[#1A1614] mb-3 md:mb-4"
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Lokacija
                </h3>
                <p className="text-[#1A1614]/80 leading-relaxed text-sm md:text-base">
                  Resort se nalazi na mirnoj lokaciji, okružen zelenilom, ali istovremeno u neposrednoj blizini centra Vrnjačke Banje. 
                  Ova pozicija omogućava savršen balans između privatnosti i dostupnosti svih sadržaja i atrakcija u gradu. 
                  Posetioci mogu uživati u tišini i spokoju, dok su istovremeno blizu svih važnih tačaka Vrnjačke Banje.
                </p>
              </div>

              <div>
                <h3 
                  className="text-lg md:text-xl text-[#1A1614] mb-3 md:mb-4"
                  style={{ fontFamily: 'Playfair Display' }}
                >
                  Sadržaji
                </h3>
                <p className="text-[#1A1614]/80 leading-relaxed text-sm md:text-base">
                  Resort takođe uključuje privatni bazen, dostupan isključivo vlasnicima stanova, kao i prostor za roštiljanje 
                  i paviljone koji su savršeni za opuštanje sa prijateljima i porodicom. Za najmlađe, tu je i uredno dečije igralište, 
                  dok je ceo kompleks okružen prelepim uređenim dvorištem, idealnim za uživanje u prirodi.
                </p>
              </div>

              {/* Contact Button */}
              <div className="space-y-3 md:space-y-4 mt-4 md:mt-6 sticky bottom-0 bg-[#F5E6D3] pt-4 -mx-6 px-6 md:mx-0 md:px-0 md:static md:bg-transparent">
                <button 
                  onClick={() => {
                    onClose();
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      const viewportHeight = window.innerHeight;
                      const sectionTop = contactSection.getBoundingClientRect().top + window.scrollY;
                      const offset = sectionTop - (viewportHeight * 0.2);
                      
                      window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="w-full relative overflow-hidden bg-[#1A1614] text-[#D4AF37] px-4 md:px-6 py-3 md:py-4 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1A1614]/90 group"
                >
                  <span className="relative z-10 flex items-center justify-center text-base">
                    Kontaktirajte nas
                    <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                </button>
                
                <button 
                  onClick={() => {
                    onClose();
                    const villasGrid = document.querySelector('.villas-grid');
                    if (villasGrid) {
                      const viewportHeight = window.innerHeight;
                      const sectionTop = villasGrid.getBoundingClientRect().top + window.scrollY;
                      const offset = sectionTop - (viewportHeight * 0.2);
                      
                      window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="w-full relative overflow-hidden bg-[#D4AF37] text-black px-4 md:px-6 py-3 md:py-4 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E5C048] group"
                >
                  <span className="relative z-10 flex items-center justify-center text-base">
                    Pogledajte ponudu
                    <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortModal;