import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ApartmentCard from './ApartmentCard';

interface FloorSectionProps {
  title: string;
  apartments: Array<{
    id: number | string;
    number: number;
    size: number | string;
    type: string;
  }>;
  onSelectApartment: (apartment: any) => void;
  tone?: 'light' | 'sand';
  /** Dodatni props za karticu (slika/status iz baze) po stanu. */
  resolveCard?: (apartment: any) => { imageSrc?: string; soldOverride?: boolean; outdoorLabel?: string };
}

const FloorSection: React.FC<FloorSectionProps> = ({ title, apartments, onSelectApartment, tone = 'light', resolveCard }) => {
  return (
    <section className={tone === 'sand' ? 'section-sand' : 'section-light'}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        {/* Floor heading */}
        <div className="mb-12 text-center">
          <span className="eyebrow">Etaža</span>
          <h2 className="heading mt-4 text-ts-h4 text-royal-ink md:text-ts-h3" style={{ fontFamily: 'Playfair Display' }}>
            {title}
          </h2>
          <div className="gold-rule mt-5" />
        </div>

        {/* Mobile Swiper */}
        <div className="lg:hidden">
          <Swiper
            modules={[SwiperNavigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            speed={700}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 2 } }}
            className="floor-section-swiper"
          >
            {apartments.map((apartment) => (
              <SwiperSlide key={apartment.id} className="h-auto">
                <ApartmentCard
                  apartment={apartment}
                  floorName={title}
                  onSelect={() => onSelectApartment(apartment)}
                  {...(resolveCard ? resolveCard(apartment) : {})}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden gap-7 lg:grid lg:grid-cols-3">
          {apartments.map((apartment, i) => (
            <div key={apartment.id} className="scroll-animate from-bottom" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <ApartmentCard
                apartment={apartment}
                floorName={title}
                onSelect={() => onSelectApartment(apartment)}
                {...(resolveCard ? resolveCard(apartment) : {})}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FloorSection);
