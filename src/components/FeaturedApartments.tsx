import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchFeaturedApartments, apartmentPath, type FeaturedApartment } from '../lib/buildingsApi';

const FeaturedApartments = () => {
  const [apartments, setApartments] = useState<FeaturedApartment[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchFeaturedApartments()
      .then(setApartments)
      .catch(() => undefined);
  }, []);

  if (apartments.length === 0) return null;

  return (
    <section className="section-light">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <SectionHeading
          eyebrow="Izdvajamo iz ponude"
          title="Istaknuti stanovi u Vrnjačkoj Banji"
          subtitle="Pažljivo odabrani stanovi iz naše aktuelne ponude, direktno od investitora."
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {apartments.map((a, i) => {
            const href = apartmentPath(a.buildings.slug, a.number);
            return (
              <div key={a.id} className="scroll-animate from-bottom" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <Link to={href} className="block h-full" aria-label={`Stan ${a.number} — ${a.buildings.name}`}>
                  <article className="card-royal group flex h-full flex-col">
                    {/* Slika */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={a.card_image_url ?? '/images/Rudjinci A1.webp'}
                        alt={`${a.type} stan broj ${a.number} — ${a.buildings.name}, Kralj Residence Vrnjačka Banja`}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className={`chip-status absolute left-4 top-4 shadow-royal-sm ${a.sold ? 'chip-sold' : 'chip-available'}`}>
                        {a.sold ? 'Prodato' : 'Dostupno'}
                      </span>
                    </div>

                    {/* Sadržaj */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="heading mb-5 text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                        Stan {a.number}
                        <span className="mt-1 block text-ts-p font-normal text-royal-stone" style={{ fontFamily: 'Cormorant Garamond' }}>
                          {a.type} · {a.size_label}
                        </span>
                      </h3>

                      <div className="mt-auto flex items-center justify-between border-t border-royal-ink/10 pt-5">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold-deep">
                          <Building2 className="h-4 w-4" />
                          {a.buildings.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-royal-stone/70 transition-colors group-hover:text-gold-deep">
                          Pogledaj
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedApartments;
