import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Building2, Home } from 'lucide-react';
import { type Building, updateBuilding } from '../../lib/buildingsApi';
import { Toggle } from './ui';

interface Props {
  buildings: Building[];
  onChanged: () => void;
}

const HomeManager = ({ buildings, onChanged }: Props) => {
  const [error, setError] = useState('');

  const featured = useMemo(
    () => buildings.filter((b) => b.featured_home).sort((a, b) => a.home_sort - b.home_sort),
    [buildings]
  );
  const rest = useMemo(() => buildings.filter((b) => !b.featured_home), [buildings]);

  const run = async (fn: () => Promise<void>) => {
    try {
      await fn();
      setError('');
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? 'Greška pri čuvanju');
    }
  };

  const toggleHome = (b: Building) =>
    run(async () => {
      const nextSort = b.featured_home ? 0 : (featured.length ? Math.max(...featured.map((f) => f.home_sort)) : 0) + 1;
      await updateBuilding(b.id, { featured_home: !b.featured_home, home_sort: nextSort });
    });

  const move = (index: number, dir: -1 | 1) =>
    run(async () => {
      const target = index + dir;
      if (target < 0 || target >= featured.length) return;
      const reordered = [...featured];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      // normalizuj home_sort na 1..n
      for (let i = 0; i < reordered.length; i++) {
        if (reordered[i].home_sort !== i + 1) {
          await updateBuilding(reordered[i].id, { home_sort: i + 1 });
        }
      }
    });

  const toneFor = (i: number) => ['Bela', 'Braon', 'Bež'][i % 3];

  return (
    <div>
      <div className="mb-6">
        <h2 className="heading text-ts-h4 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
          Početna strana
        </h2>
        <p className="mt-1 text-sm text-royal-stone">
          Zgrade koje se prikazuju kao velike sekcije na početnoj stranici. Pozadine se automatski
          smenjuju: bela → braon → bež.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Greška: {error}</p>
          {error.toLowerCase().includes('featured_home') && (
            <p className="mt-2 text-sm">
              Pokreni migraciju iz fajla <code className="rounded bg-white px-1.5 py-0.5">supabase/migration-featured.sql</code>{' '}
              u Supabase SQL Editoru.
            </p>
          )}
        </div>
      )}

      {/* Na početnoj */}
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
        <Home className="h-4 w-4" />
        Prikazane na početnoj ({featured.length})
      </h3>
      <div className="mb-10 space-y-2">
        {featured.map((b, i) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gold/50 bg-white px-4 py-3 shadow-royal-sm ring-1 ring-gold/20">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold-deep">
              {i + 1}
            </span>
            {b.image_url ? (
              <img src={b.image_url} alt={b.name} className="h-12 w-20 rounded-md object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-gold-deep" />
            )}
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-royal-ink">{b.name}</span>
              <span className="ml-2 text-sm text-royal-stone">
                {b.status} · pozadina: {toneFor(i)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-full border border-royal-ink/15 p-2 text-royal-stone transition hover:border-gold hover:text-gold-deep disabled:opacity-30"
                aria-label="Pomeri gore"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === featured.length - 1}
                className="rounded-full border border-royal-ink/15 p-2 text-royal-stone transition hover:border-gold hover:text-gold-deep disabled:opacity-30"
                aria-label="Pomeri dole"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <Toggle checked onChange={() => toggleHome(b)} labelOn="Na početnoj" labelOff="Uključi" />
            </div>
          </div>
        ))}
        {featured.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-royal-ink/20 p-6 text-center text-sm text-royal-stone">
            Nijedna zgrada nije uključena. Uključi neku iz liste ispod.
          </p>
        )}
      </div>

      {/* Ostale zgrade */}
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-royal-stone">
        Ostale zgrade
      </h3>
      <div className="space-y-2">
        {rest.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-royal-ink/10 bg-white px-4 py-3 shadow-royal-sm">
            {b.image_url ? (
              <img src={b.image_url} alt={b.name} className="h-12 w-20 rounded-md object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-royal-stone" />
            )}
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-royal-ink">{b.name}</span>
              <span className="ml-2 text-sm text-royal-stone">{b.status}</span>
              {!b.visible && (
                <span className="ml-2 rounded-full bg-royal-ink/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-royal-stone">
                  Skrivena
                </span>
              )}
            </div>
            <Toggle checked={false} onChange={() => toggleHome(b)} labelOn="Na početnoj" labelOff="Uključi" />
          </div>
        ))}
        {rest.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-royal-ink/20 p-6 text-center text-sm text-royal-stone">
            Sve zgrade su već na početnoj.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeManager;
