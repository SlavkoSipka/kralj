import React from 'react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: {
    id: number;
    number: number;
    size: number;
    type: string;
  };
  floorName: string;
  onSelect: () => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, floorName, onSelect }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-[#1A1614] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] scroll-animate from-bottom">
      {/* Decorative corners */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
          (window.location.pathname === '/villa-3' && [1, 3,  4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
          (window.location.pathname === '/villa-3' && apartment.number === 5) ||
          (window.location.pathname === '/villa-3' && apartment.number === 22) ||
          (window.location.pathname === '/villa-3' && apartment.number === 25) ||
          (window.location.pathname === '/villa-3' && apartment.number === 24) ||
          (window.location.pathname === '/villa-3' && apartment.number === 8) ||
          (window.location.pathname === '/villa-3' && apartment.number === 14) ||
          (window.location.pathname === '/villa-3' && apartment.number === 23) ||
          (window.location.pathname === '/villa-3' && apartment.number === 8) ||
        (window.location.pathname === '/villa-3' && apartment.number === 23) ||
        (window.location.pathname === '/villa-3' && apartment.number === 19) ||
        (window.location.pathname === '/villa-4' && [1, 4, 5, 8, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
         (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))
          ? 'bg-black/80 text-[#D4AF37] border border-[#D4AF37]' 
          : 'bg-[#D4AF37] text-black'
        }`}>
          {(window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
           (window.location.pathname === '/villa-3' && apartment.number === 5) ||
           (window.location.pathname === '/villa-3' && apartment.number === 22) ||
           (window.location.pathname === '/villa-3' && apartment.number === 25) ||
           (window.location.pathname === '/villa-3' && apartment.number === 24) ||
           (window.location.pathname === '/villa-3' && apartment.number === 8) ||
          (window.location.pathname === '/villa-3' && apartment.number === 19) ||
          (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 21, 26, 27].includes(apartment.number)) ||
           (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))
            ? 'Prodato' : 'Dostupno'}
        </span>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={
            window.location.pathname === '/royal-aqua' ? (
              apartment.number === 1 ?
              "http://aislike.rs/Kralj1/royal/stan 1.png" :
              apartment.number === 2 ?
              "http://aislike.rs/Kralj1/royal/stan 2.png" :
              apartment.number === 3 ?
              "http://aislike.rs/Kralj1/royal/stan 3.png" :
              apartment.number === 4 ?
              "http://aislike.rs/Kralj1/royal/stan 4.png" :
              apartment.number === 5 ?
              "http://aislike.rs/Kralj1/royal/stan 5.png" :
              apartment.number === 6 ?
              "http://aislike.rs/Kralj1/royal/stan 6.png" :
              apartment.number === 7 ?
              "http://aislike.rs/Kralj1/royal/stan 7.png" :
              apartment.number === 8 ?
              "http://aislike.rs/Kralj1/royal/stan 8.png" :
              apartment.number === 9 ?
              "http://aislike.rs/Kralj1/royal/stan 9.png" :
              apartment.number === 10 ?
              "http://aislike.rs/Kralj1/royal/stan 10.png" :
              apartment.number === 11 ?
              "http://aislike.rs/Kralj1/royal/stan 11.png" :
              apartment.number === 12 ?
              "http://aislike.rs/Kralj1/royal/stan 5.png" :
              apartment.number === 13 ?
              "http://aislike.rs/Kralj1/royal/stan 6.png" :
              apartment.number === 14 ?
              "http://aislike.rs/Kralj1/royal/stan 7.png" :
              apartment.number === 15 ?
              "http://aislike.rs/Kralj1/royal/stan 8.png" :
              apartment.number === 16 ?
              "http://aislike.rs/Kralj1/royal/stan 9.png" :
              apartment.number === 17 ?
              "http://aislike.rs/Kralj1/royal/stan 10.png" :
              apartment.number === 18 ?
              "http://aislike.rs/Kralj1/royal/stan 11.png" :
              apartment.number === 19 ?
              "http://aislike.rs/Kralj1/royal/stan 5.png" :
              apartment.number === 20 ?
              "http://aislike.rs/Kralj1/royal/stan 6.png" :
              apartment.number === 21 ?
              "http://aislike.rs/Kralj1/royal/stan 7.png" :
              apartment.number === 22 ?
              "http://aislike.rs/Kralj1/royal/stan 8.png" :
              apartment.number === 23 ?
              "http://aislike.rs/Kralj1/royal/stan 9.png" :
              apartment.number === 24 ?
              "http://aislike.rs/Kralj1/royal/stan 10.png" :
              apartment.number === 25 ?
              "http://aislike.rs/Kralj1/royal/stan 11.png" :
              apartment.number === 26 ?
              "http://aislike.rs/Kralj1/royal/stan 26.png" :
              "http://aislike.rs/Kralj1/royal/stan 27.png"
            ) : window.location.pathname === '/villa-3' ? (
              apartment.number === 3 || apartment.number === 6 || apartment.number === 12 || apartment.number === 18 || apartment.number === 24 ?
              "http://aislike.rs/Kralj1/vila3/3d dvosoban.png" :
              apartment.number === 2 || apartment.number === 5 || apartment.number === 11 || apartment.number === 17 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 1 || apartment.number === 4 || apartment.number === 10 || apartment.number === 16 || apartment.number === 22 ?
              "http://aislike.rs/Kralj1/vila3/lift3d.png" :
              apartment.number === 7 || apartment.number === 13 || apartment.number === 19 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 8 || apartment.number === 14 || apartment.number === 20 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 9 || apartment.number === 15 || apartment.number === 21 || apartment.number === 27 ?
              "http://aislike.rs/Kralj1/vila3/3d garsonjera.png" :
              "http://aislike.rs/Kralj1/vila3/basic3d.png"
            ) : (
              apartment.number === 1 || apartment.number === 7 || apartment.number === 13 || apartment.number === 19 || apartment.number === 25 ?
              "http://aislike.rs/Kralj1/vila3/kosa3d.png" :
              apartment.number === 2 || apartment.number === 8 || apartment.number === 14 || apartment.number === 20 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 3 || apartment.number === 9 || apartment.number === 15 || apartment.number === 21 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 4 || apartment.number === 10 || apartment.number === 16 || apartment.number === 22 ?
              "http://aislike.rs/Kralj1/vila3/3d garsonjera.png" :
              apartment.number === 5 || apartment.number === 11 || apartment.number === 17 || apartment.number === 23 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              apartment.number === 6 || apartment.number === 12 || apartment.number === 18 || apartment.number === 24 ?
              "http://aislike.rs/Kralj1/vila3/basic3d.png" :
              "http://aislike.rs/Kralj1/vila3/basic3d.png"
            )
          }
          alt={`Kralj Residence - Luksuzni ${apartment.type} stan broj ${apartment.number} u Vrnjačkoj Banji`}
          className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Title */}
        <div className="mb-6 relative">
          <h3 
            className="text-2xl text-[#D4AF37] mb-2"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Stan broj <span className="text-3xl">{apartment.number}</span> - {apartment.type}
          </h3>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 relative">
          <div className="text-center p-3 bg-black/20 rounded-lg transform transition-all duration-300 group-hover:translate-y-[-2px] hover:bg-black/30">
            <p className="text-[#D4AF37] font-medium text-xs mb-1">Površina</p>
            <p className="text-cream-100 font-medium text-lg" style={{ fontFamily: 'Playfair Display' }}>
              {typeof apartment.size === 'string' ? apartment.size : `${apartment.size}m²`}
            </p>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-lg transform transition-all duration-300 group-hover:translate-y-[-2px] hover:bg-black/30">
            <p className="text-[#D4AF37] font-medium text-xs mb-1">Sprat</p>
            <p className="text-cream-100 font-medium text-base" style={{ fontFamily: 'Playfair Display' }}>{floorName}</p>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-lg transform transition-all duration-300 group-hover:translate-y-[-2px] hover:bg-black/30">
            <p className="text-[#D4AF37] font-medium text-xs mb-1">{window.location.pathname === '/royal-aqua' && [1, 2, 3, 4, 5, 6, 10, 11].includes(apartment.number) ? 'Dvorište' : 'Terasa'}</p>
            <p className="text-cream-100 font-medium text-lg" style={{ fontFamily: 'Playfair Display' }}>Da</p>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={!((window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 5) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 22) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 24) ||
                   (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
                    (window.location.pathname === '/villa-3' && [4, 27].includes(apartment.number)) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 14) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 23) ||
                   (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number)))
              ? onSelect : undefined}
          disabled={(window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 5) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 22) ||
                    (window.location.pathname === '/villa-3' && apartment.number === 24) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 19) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 19) ||
                   (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 14) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 23) ||
                   (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))}
          className={`relative w-full overflow-hidden ${
            (window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
            (window.location.pathname === '/villa-3' && apartment.number === 5) ||
                   (window.location.pathname === '/villa-3' && apartment.number === 25) ||
           (window.location.pathname === '/villa-3' && apartment.number === 8) ||
           (window.location.pathname === '/villa-3' && apartment.number === 19) ||
           (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
            (window.location.pathname === '/villa-3' && apartment.number === 14) ||
            (window.location.pathname === '/villa-3' && apartment.number === 23) ||
            (window.location.pathname === '/villa-3' && [4, 27].includes(apartment.number)) ||
           (window.location.pathname === '/villa-3' && apartment.number === 8) ||
            (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))
            ? 'bg-black/80 text-[#D4AF37] border border-[#D4AF37] cursor-default'
            : 'bg-[#D4AF37] text-black hover:bg-[#E5C048]'
          } px-6 py-3 rounded-lg text-sm tracking-wider font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 group`}
        >
          <span className="relative z-10 flex items-center justify-center">
            {(window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
             (window.location.pathname === '/villa-3' && apartment.number === 5) ||
             (window.location.pathname === '/villa-3' && apartment.number === 22) ||
              (window.location.pathname === '/villa-3' && apartment.number === 23) ||
             (window.location.pathname === '/villa-3' && apartment.number === 23) ||
            (window.location.pathname === '/villa-3' && apartment.number === 23) ||
            (window.location.pathname === '/villa-3' && apartment.number === 8) ||
            (window.location.pathname === '/villa-3' && apartment.number === 19) ||
             (window.location.pathname === '/villa-3' && apartment.number === 14) ||
             (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
             (window.location.pathname === '/villa-3' && [4, 27].includes(apartment.number)) ||
             (window.location.pathname === '/villa-3' && apartment.number === 8) ||
             (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))
              ? 'PRODATO' : 'Pogledajte stan'}
            {!((window.location.pathname === '/villa-3' && [1, 3, 4, 6, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
                (window.location.pathname === '/villa-3' && apartment.number === 5) ||
                (window.location.pathname === '/villa-3' && apartment.number === 22) ||
                (window.location.pathname === '/villa-3' && apartment.number === 25) ||
                (window.location.pathname === '/villa-3' && apartment.number === 24) ||
               (window.location.pathname === '/villa-3' && apartment.number === 19) ||
                (window.location.pathname === '/villa-4' && [1, 4, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
                (window.location.pathname === '/villa-3' && apartment.number === 14) ||
                (window.location.pathname === '/villa-3' && apartment.number === 23) ||
                (window.location.pathname === '/villa-3' && apartment.number === 4) ||
               (window.location.pathname === '/villa-3' && apartment.number === 8) ||
                (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))) && (
              <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            )}
          </span>
          {!((window.location.pathname === '/villa-3' && [1, 2, 3, 9, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 27].includes(apartment.number)) ||
              (window.location.pathname === '/villa-3' && apartment.number === 5) ||
              (window.location.pathname === '/villa-3' && apartment.number === 22) ||
              (window.location.pathname === '/villa-3' && apartment.number === 4) ||
              (window.location.pathname === '/villa-3' && apartment.number === 25) ||
              (window.location.pathname === '/villa-3' && apartment.number === 24) ||
             (window.location.pathname === '/villa-3' && apartment.number === 19) ||
              (window.location.pathname === '/villa-4' && [1, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 26, 27].includes(apartment.number)) ||
             (window.location.pathname === '/villa-3' && apartment.number === 8) ||
              (window.location.pathname === '/villa-3' && apartment.number === 14) ||
              (window.location.pathname === '/villa-3' && apartment.number === 23) ||
              (window.location.pathname === '/royal-aqua' && [2, 3, 7, 8, 9, 12, 14, 15, 16, 18, 22, 23, 26, 27].includes(apartment.number))) && (
            <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ApartmentCard);