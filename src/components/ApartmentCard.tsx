import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { isApartmentSold } from '../constants/apartmentAvailability';

interface ApartmentCardProps {
  apartment: {
    id: number | string;
    number: number;
    size: number | string;
    type: string;
  };
  floorName: string;
  onSelect?: () => void;
  /** Direktna slika (za zgrade iz baze); ako izostane, koristi se legacy mapiranje po ruti. */
  imageSrc?: string;
  /** Direktan status (za zgrade iz baze); ako izostane, koristi se legacy logika po ruti. */
  soldOverride?: boolean;
  /** Labela spoljnog prostora; ako izostane, izvodi se iz rute. */
  outdoorLabel?: string;
  /** Vrednost spoljnog prostora (npr. "2.32 m²" ili "Ne"); podrazumevano "Da". */
  outdoorValue?: string;
  /** Stranica stana; kada postoji, kartica vodi na nju umesto da otvara popup. */
  href?: string;
}

const royalImage = (n: number) => {
  const map: Record<number, string> = {
    1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11',
    12: '5', 13: '6', 14: '7', 15: '8', 16: '9', 17: '10', 18: '11', 19: '5', 20: '6', 21: '7',
    22: '8', 23: '9', 24: '10', 25: '11', 26: '26', 27: '27',
  };
  return `/images/royal/stan ${map[n] ?? '27'}.webp`;
};

const villa3Image = (n: number) => {
  if ([3, 6, 12, 18, 24].includes(n)) return '/images/vila3/3d dvosoban.webp';
  if ([9, 15, 21, 27].includes(n)) return '/images/vila3/3d garsonjera.webp';
  if ([1, 4, 10, 16, 22].includes(n)) return '/images/vila3/lift3d.webp';
  return '/images/vila3/basic3d.webp';
};

const villa4Image = (n: number) => {
  if ([1, 7, 13, 19, 25].includes(n)) return '/images/vila3/kosa3d.webp';
  if ([4, 10, 16, 22].includes(n)) return '/images/vila3/3d garsonjera.webp';
  return '/images/vila3/basic3d.webp';
};

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  floorName,
  onSelect,
  imageSrc,
  soldOverride,
  outdoorLabel,
  outdoorValue,
  href,
}) => {
  const { pathname } = useLocation();
  const sold = soldOverride ?? isApartmentSold(pathname, apartment.number);

  const imgSrc =
    imageSrc ??
    (pathname === '/royal-aqua'
      ? royalImage(apartment.number)
      : pathname === '/villa-3'
      ? villa3Image(apartment.number)
      : villa4Image(apartment.number));

  const areaLabel =
    outdoorLabel ??
    (pathname === '/royal-aqua' && [1, 2, 3, 4, 5, 6, 10, 11].includes(apartment.number) ? 'Dvorište' : 'Terasa');

  return (
    <article
      className={`card-royal group flex h-full flex-col scroll-animate from-bottom ${
        sold ? 'hover:-translate-y-0 hover:shadow-royal-sm' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {href && !sold && (
          <Link to={href} className="absolute inset-0 z-10" aria-label={`Pogledajte stan ${apartment.number}`} />
        )}
        <img
          src={imgSrc}
          alt={`Kralj Residence — ${apartment.type} stan broj ${apartment.number} u Vrnjačkoj Banji`}
          className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out ${
            sold ? 'grayscale' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          decoding="async"
        />
        <div
          className={`absolute inset-0 ${
            sold ? 'bg-night/55' : 'bg-gradient-to-t from-black/45 via-transparent to-transparent'
          }`}
        />
        {sold ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-night/45 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <Lock className="h-4 w-4" />
              Prodato
            </span>
          </div>
        ) : (
          <span className="chip-status chip-available absolute left-4 top-4 shadow-royal-sm">Dostupno</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
          Stan {apartment.number}
          <span className="mt-1 block text-ts-p font-normal capitalize text-royal-stone" style={{ fontFamily: 'Cormorant Garamond' }}>
            {apartment.type}
          </span>
        </h3>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            ['Površina', typeof apartment.size === 'string' ? apartment.size : `${apartment.size} m²`],
            ['Sprat', floorName],
            [areaLabel, outdoorValue ?? 'Da'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-royal-ink/[0.04] p-3 text-center">
              <p className="text-xs uppercase tracking-wider text-gold-deep">{label}</p>
              <p className="mt-1 text-ts-h6 font-medium text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6">
          {sold ? (
            <span className="chip-status chip-sold w-full justify-center py-2.5">Prodato</span>
          ) : href ? (
            <Link to={href} className="btn-royal w-full">
              Pogledajte stan
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button onClick={onSelect} className="btn-royal w-full">
              Pogledajte stan
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default React.memo(ApartmentCard);
