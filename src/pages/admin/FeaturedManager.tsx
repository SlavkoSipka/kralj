import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';
import {
  type FeaturedApartment,
  fetchAllApartmentsWithBuilding,
  updateApartment,
} from '../../lib/buildingsApi';
import { Toggle } from './ui';

const FeaturedManager = () => {
  const [apartments, setApartments] = useState<FeaturedApartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setApartments(await fetchAllApartmentsWithBuilding());
    } catch (err: any) {
      // Najčešći uzrok: kolona "featured" još nije dodata u bazu
      setError(err?.message ?? 'Greška pri učitavanju');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFeatured = async (a: FeaturedApartment) => {
    try {
      await updateApartment(a.id, { featured: !a.featured });
      setApartments((prev) => prev.map((x) => (x.id === a.id ? { ...x, featured: !a.featured } : x)));
      setError('');
    } catch (err: any) {
      setError(err?.message ?? 'Greška pri čuvanju');
    }
  };

  const featuredCount = apartments.filter((a) => a.featured).length;

  const groups = useMemo(() => {
    const map = new Map<string, FeaturedApartment[]>();
    for (const a of apartments) {
      const key = a.buildings.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return Array.from(map.entries());
  }, [apartments]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  const errorBox = error && (
    <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-5 text-red-700">
      <p className="font-semibold">Greška: {error}</p>
      {error.toLowerCase().includes('featured') && (
        <p className="mt-2 text-sm">
          Kolona "featured" ne postoji u bazi. Pokreni u Supabase SQL Editoru:{' '}
          <code className="rounded bg-white px-1.5 py-0.5">
            alter table public.apartments add column if not exists featured boolean not null default false;
          </code>
        </p>
      )}
    </div>
  );

  if (error && apartments.length === 0) {
    return <div>{errorBox}</div>;
  }

  return (
    <div>
      {errorBox}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="heading text-ts-h4 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
            Izdvajamo iz ponude
          </h2>
          <p className="mt-1 text-sm text-royal-stone">
            Selektovani stanovi se prikazuju na početnoj stranici u sekciji "Izdvajamo iz ponude".
            Trenutno istaknuto: <strong className="text-gold-deep">{featuredCount}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {groups.map(([buildingName, apts]) => (
          <div key={buildingName}>
            <h3 className="heading mb-3 text-ts-h6 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
              {buildingName}
            </h3>
            <div className="space-y-2">
              {apts.map((a) => (
                <div
                  key={a.id}
                  className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white px-4 py-2.5 shadow-royal-sm transition ${
                    a.featured ? 'border-gold/60 ring-1 ring-gold/30' : 'border-royal-ink/10'
                  }`}
                >
                  {a.featured && <Star className="h-4 w-4 flex-shrink-0 fill-gold text-gold" />}
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-royal-ink">Stan {a.number}</span>
                    <span className="ml-2 text-sm text-royal-stone">
                      {a.type} · {a.size_label} · {a.floor_name}
                    </span>
                    {a.sold && (
                      <span className="ml-2 rounded-full bg-royal-ink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-stone">
                        Prodat
                      </span>
                    )}
                    {!a.visible && (
                      <span className="ml-2 rounded-full bg-royal-ink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-stone">
                        Skriven
                      </span>
                    )}
                  </div>
                  <Toggle
                    checked={a.featured}
                    onChange={() => toggleFeatured(a)}
                    labelOn="Istaknut"
                    labelOff="Istakni"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-royal-ink/20 p-8 text-center text-royal-stone">
            Nema stanova u bazi.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedManager;
