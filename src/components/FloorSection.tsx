import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ApartmentCard from './ApartmentCard';

interface FloorSectionProps {
  title: string;
  apartments: Array<{
    id: number;
    number: number;
    size: number;
    type: string;
  }>;
  onSelectApartment: (apartment: any) => void;
}

const FloorSection: React.FC<FloorSectionProps> = ({ title, apartments, onSelectApartment }) => {
  return (
    <div className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/95">
        <div className="absolute inset-0 bg-[#F5E6D3]/5 mix-blend-overlay"></div>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #D4AF37 1px, transparent 1px),
              linear-gradient(-45deg, #D4AF37 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center',
            mask: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        ></div>
        <div className="absolute inset-0 bg-radial-gradient"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="mb-12">
          <div className="inline-block relative">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]/30"></div>
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-light">{title}</span>
              <div className="w-12 h-[1px] bg-[#D4AF37]/30"></div>
            </div>
          </div>
        </div>

        {/* Mobile Swiper */}
        <div className="lg:hidden">
          <Swiper
            modules={[SwiperNavigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={false}
            centeredSlides={false}
            watchSlidesProgress={true}
            speed={800}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { 
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 24
              }
            }}
            className="floor-section-swiper"
          >
            {apartments.map((apartment) => (
              <SwiperSlide 
                key={apartment.id} 
                className="group relative overflow-hidden rounded-xl"
              >
                <ApartmentCard
                  apartment={apartment}
                  floorName={title}
                  onSelect={() => onSelectApartment(apartment)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {apartments.map((apartment) => (
            <div key={apartment.id}>
              <ApartmentCard
                apartment={apartment}
                floorName={title}
                onSelect={() => onSelectApartment(apartment)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FloorSection);