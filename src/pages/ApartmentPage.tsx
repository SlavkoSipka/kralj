import { useState, useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Download, ExternalLink, Phone } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import ThankYouModal from '../components/ThankYouModal';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSeo } from '../hooks/useSeo';
import { apartmentPath, buildingPath, hasApartmentPages, type ApartmentRow } from '../lib/buildingsApi';
import { loadBuildingData, type BuildingData } from '../lib/buildingData';

const SITE_URL = 'https://kraljresidence.rs';

interface ApartmentPageProps {
  /** Fiksni slug (/vila-5/stan-12); ako izostane, čita se iz URL-a (/zgrada/:slug/stan-12). */
  slug?: string;
}

/** "stan-12" -> 12 */
const parseApartmentNumber = (param?: string) => {
  const match = param?.match(/^stan-(\d+)$/);
  return match ? parseInt(match[1], 10) : NaN;
};

const absoluteUrl = (url: string) => (url.startsWith('/') ? `${SITE_URL}${url}` : url);

const sizeOf = (a: ApartmentRow) => parseFloat(a.size_label.replace(',', '.')) || 0;

/**
 * Ponuda drugih stanova, svaki sa svojim 3D prikazom: stanovi istog rasporeda na drugim spratovima
 * dele 3D, pa se od njih nudi samo jedan, a raspored trenutnog stana se preskače.
 * Redosled: isti tip, pa najbliža površina, pa isti sprat. Prodati stanovi se ne nude.
 */
const findSimilar = (current: ApartmentRow, all: ApartmentRow[], limit: number) => {
  const rank = (a: ApartmentRow) => [
    a.type === current.type ? 0 : 1,
    Math.abs(sizeOf(a) - sizeOf(current)),
    a.floor_name === current.floor_name ? 0 : 1,
    a.number,
  ];
  const seen = new Set([current.card_image_url ?? current.id]);
  return all
    .filter((a) => a.id !== current.id && !a.sold)
    .map((a) => ({ a, r: rank(a) }))
    .sort((x, y) => {
      const i = x.r.findIndex((v, k) => v !== y.r[k]);
      return i === -1 ? 0 : x.r[i] - y.r[i];
    })
    .map(({ a }) => a)
    .filter((a) => {
      const key = a.card_image_url ?? a.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
};

/** Mala kartica ponuđenog stana sa njegovim 3D prikazom, isto kao na kartici na stranici zgrade */
const SimilarCard = ({ apartment, href }: { apartment: ApartmentRow; href: string }) => (
  <Link
    to={href}
    className="card-royal group block"
    aria-label={`Stan ${apartment.number}, ${apartment.type}, ${apartment.size_label}`}
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      {apartment.card_image_url && (
        <img
          src={apartment.card_image_url}
          alt={`${apartment.type} stan broj ${apartment.number}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="chip-status chip-available absolute left-2.5 top-2.5 !px-2.5 !py-0.5 !text-[10px] shadow-royal-sm">
        Dostupno
      </span>
    </div>
    <div className="p-3.5 md:p-4">
      <h3 className="heading text-ts-h6 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
        Stan {apartment.number}
      </h3>
      <p className="mt-0.5 text-sm text-royal-stone">
        {apartment.type} · {apartment.size_label}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-royal-ink/10 pt-3">
        <span className="truncate text-[11px] uppercase tracking-wider text-gold-deep">{apartment.floor_name}</span>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </div>
  </Link>
);

/** Posebna stranica jednog stana (Vila V i novi projekti; stari projekti koriste popup). */
const ApartmentPage = ({ slug: slugProp }: ApartmentPageProps) => {
  const params = useParams<{ slug: string; apartment: string }>();
  const slug = slugProp ?? params.slug ?? '';
  const number = parseApartmentNumber(params.apartment);

  const [data, setData] = useState<BuildingData | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  useIntersectionObserver();

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    loadBuildingData(slug).then((result) => {
      if (cancelled) return;
      setData(result);
      setState(result ? 'ready' : 'missing');
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const building = data?.building ?? null;
  const apartment = data?.apartments.find((a) => a.number === number) ?? null;
  const similar = useMemo(
    () => (apartment && data ? findSimilar(apartment, data.apartments, 6) : []),
    [apartment, data]
  );

  useSeo({
    title:
      apartment && building
        ? `Stan ${apartment.number}, ${apartment.type.toLowerCase()} ${apartment.size_label} · ${building.name} | Kralj Residence`
        : 'Stan za prodaju u Vrnjačkoj Banji | Kralj Residence',
    description:
      apartment && building
        ? `${apartment.type} stan broj ${apartment.number} u objektu ${building.name}, ${apartment.floor_name.toLowerCase()}, površina ${apartment.size_label}. Novogradnja u Vrnjačkoj Banji uz direktnu prodaju od investitora.`
        : 'Novogradnja i direktna prodaja stanova u Vrnjačkoj Banji od investitora.',
    path: `${buildingPath(slug)}/stan-${number}`,
    image: apartment?.card_image_url ? absoluteUrl(apartment.card_image_url) : undefined,
  });

  if (!hasApartmentPages(slug)) {
    return <Navigate to={Number.isNaN(number) ? buildingPath(slug) : apartmentPath(slug, number)} replace />;
  }

  if (state === 'missing') {
    return <Navigate to="/properties" replace />;
  }

  if (state === 'loading' || !data || !building) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-royal-ivory">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!apartment) {
    return <Navigate to={buildingPath(slug)} replace />;
  }

  const sold = apartment.sold;
  const sheet = apartment.plan_image_url;
  /** Gore ide list stana iz PDF-a; ako ga nema, gore ide 3D prikaz */
  const topImage = sheet ?? apartment.card_image_url;

  const facts: [string, string][] = [
    ['Tip', apartment.type],
    ['Sprat', apartment.floor_name],
    [apartment.outdoor_label, apartment.outdoor_value ?? 'Da'],
    ['Objekat', building.name],
  ];

  const index = data.apartments.findIndex((a) => a.id === apartment.id);
  const prev = data.apartments[index - 1];
  const next = data.apartments[index + 1];

  return (
    <div className="relative min-h-screen bg-royal-ivory overflow-x-hidden">
      <Navigation scrolled />

      <main className="section-light pt-20 md:pt-24">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          {/* Putanja, prethodni i sledeći stan */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-4 md:py-5">
            <nav aria-label="Putanja" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.14em] text-royal-stone">
              <Link to="/" className="transition-colors hover:text-gold-deep">Početna</Link>
              <span aria-hidden="true">/</span>
              <Link to="/properties" className="transition-colors hover:text-gold-deep">Nekretnine</Link>
              <span aria-hidden="true">/</span>
              <Link to={buildingPath(slug)} className="transition-colors hover:text-gold-deep">{building.name}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-royal-ink">Stan {apartment.number}</span>
            </nav>
            {(prev || next) && (
              <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.14em]">
                {prev && (
                  <Link to={apartmentPath(slug, prev.number)} className="inline-flex items-center gap-1.5 text-gold-deep transition-colors hover:text-royal-ink">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Stan {prev.number}
                  </Link>
                )}
                {next && (
                  <Link to={apartmentPath(slug, next.number)} className="inline-flex items-center gap-1.5 text-gold-deep transition-colors hover:text-royal-ink">
                    Stan {next.number}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="grid items-start gap-8 pb-12 md:pb-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-14">
            {/* Velika slika: list stana iz PDF-a */}
            {topImage ? (
              <a
                href={apartment.pdf_url ?? topImage}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative block overflow-hidden ${sheet ? 'rounded-xl2 bg-night shadow-royal' : ''}`}
                aria-label={apartment.pdf_url ? 'Otvori PDF osnovu' : 'Otvori sliku u punoj veličini'}
              >
                <img
                  src={topImage}
                  alt={`${sheet ? 'Osnova' : '3D prikaz'}: ${apartment.type.toLowerCase()} stan broj ${apartment.number}, ${building.name}`}
                  className="block h-auto w-full"
                  width={2400}
                  height={1697}
                  decoding="async"
                />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/80 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-gold backdrop-blur transition-opacity duration-300 md:right-4 md:top-4 lg:opacity-0 lg:group-hover:opacity-100">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {apartment.pdf_url ? 'Otvori PDF' : 'Uvećaj'}
                </span>
              </a>
            ) : (
              <div className="flex aspect-[7/5] items-center justify-center rounded-xl2 bg-royal-sand text-ts-p text-royal-stone">
                Slike stana uskoro
              </div>
            )}

            {/* Podaci o stanu */}
            <aside className="lg:sticky lg:top-24">
              <span className="eyebrow">{building.name}</span>
              <h1 className="heading mt-3 text-ts-h2 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                Stan {apartment.number}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="heading text-ts-h4 text-gold-deep" style={{ fontFamily: 'Playfair Display' }}>
                  {apartment.size_label}
                </span>
                <span className={`chip-status ${sold ? 'chip-sold' : 'chip-available'}`}>{sold ? 'Prodato' : 'Dostupno'}</span>
              </div>

              <dl className="mt-7 divide-y divide-royal-ink/10 border-y border-royal-ink/10">
                {facts.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-xs uppercase tracking-[0.14em] text-royal-stone">{label}</dt>
                    <dd className="text-right text-ts-h6 font-medium text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-3">
                <a href="#contact" className="btn-royal w-full">
                  {sold ? 'Pitajte za slične stanove' : 'Pošaljite upit za ovaj stan'}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="tel:+381606112327" className="btn-royal-outline w-full">
                  <Phone className="h-4 w-4" />
                  +381 60 611 2327
                </a>
                {apartment.pdf_url && (
                  <a href={apartment.pdf_url} download className="btn-ghost-gold w-full justify-center py-2">
                    <Download className="h-4 w-4" />
                    Preuzmi PDF osnovu
                  </a>
                )}
              </div>

              {apartment.description && (
                <p className="mt-7 text-ts-p leading-relaxed text-royal-stone">{apartment.description}</p>
              )}

              {building.features.length > 0 && (
                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep">U sklopu objekta</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {building.features.map((feature) => (
                      <li key={feature} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs text-royal-stone">
                        <Check className="h-3.5 w-3.5 text-gold-deep" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ===================== PONUDA DRUGIH STANOVA ===================== */}
      {similar.length > 0 && (
        <section className="section-light pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <span className="eyebrow">Ponuda</span>
            <h2 className="heading mt-3 text-ts-h4 text-royal-ink md:text-ts-h3" style={{ fontFamily: 'Playfair Display' }}>
              Slični stanovi
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ts-p text-royal-stone">
              Drugi dostupni stanovi slične površine u objektu {building.name}.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:gap-5 lg:grid-cols-3">
              {similar.map((a) => (
                <SimilarCard key={a.id} apartment={a} href={apartmentPath(slug, a.number)} />
              ))}
            </div>
            <Link to={buildingPath(slug)} className="btn-royal-outline mt-8">
              Svi stanovi u objektu {building.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ===================== KONTAKT ===================== */}
      <ContactSection
        key={apartment.id}
        title={`Zainteresovani za stan ${apartment.number}?`}
        defaultMessage={`Zanima me stan ${apartment.number} u objektu ${building.name} (${apartment.type}, ${apartment.size_label}, ${apartment.floor_name}).`}
        onSuccess={() => setIsThankYouOpen(true)}
      />

      <Footer />
      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} autoCloseDelay={2000} />
    </div>
  );
};

export default ApartmentPage;
