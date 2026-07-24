import { useState, useEffect, useCallback } from 'react';
import { LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { fetchAllBuildings, type Building } from '../../lib/buildingsApi';
import { applyTheme, fetchTheme, getCachedTheme, saveTheme, type SiteTheme } from '../../lib/theme';
import BuildingsManager from './BuildingsManager';
import ApartmentsManager from './ApartmentsManager';
import FeaturedManager from './FeaturedManager';
import HomeManager from './HomeManager';
import { Field, TextInput } from './ui';

const AdminLogin = ({ onError }: { onError: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(onError);
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError('Pogrešan email ili lozinka.');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-charcoal px-4">
      <form onSubmit={login} className="w-full max-w-sm rounded-xl2 border border-gold/20 bg-royal-ivory p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="heading mt-4 text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
            Kralj Residence Admin
          </h1>
        </div>
        <div className="space-y-4">
          <Field label="Email">
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          <Field label="Lozinka">
            <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </Field>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-royal mt-6 w-full disabled:opacity-50">
          {loading ? 'Prijava...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  );
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selected, setSelected] = useState<Building | null>(null);
  const [tab, setTab] = useState<'buildings' | 'home' | 'featured'>('buildings');
  const [theme, setTheme] = useState<SiteTheme>(getCachedTheme());

  // Admin panel je uvek u svetloj temi; po izlasku se vraća tema sajta
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark');
    fetchTheme().then(setTheme).catch(() => undefined);
    return () => applyTheme(getCachedTheme());
  }, []);

  const changeTheme = async (next: SiteTheme) => {
    setTheme(next);
    try {
      await saveTheme(next);
    } catch {
      alert('Čuvanje teme nije uspelo. Pokreni migraciju iz supabase/migration-featured.sql (tabela site_settings).');
    }
  };

  // Admin panel ne sme u Google index
  useEffect(() => {
    document.title = 'Admin | Kralj Residence';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadBuildings = useCallback(async () => {
    try {
      const list = await fetchAllBuildings();
      setBuildings(list);
      // osveži i selektovanu zgradu ako je izmenjena
      setSelected((prev) => (prev ? list.find((b) => b.id === prev.id) ?? null : null));
    } catch {
      setBuildings([]);
    }
  }, []);

  useEffect(() => {
    if (session) loadBuildings();
  }, [session, loadBuildings]);

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-royal-charcoal px-4">
        <div className="max-w-md rounded-xl2 border border-gold/20 bg-royal-ivory p-8 text-center shadow-2xl">
          <h1 className="heading text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
            Supabase nije konfigurisan
          </h1>
          <p className="mt-4 text-ts-p text-royal-stone">
            Dodaj <code className="rounded bg-royal-ink/10 px-1.5 py-0.5 text-sm">VITE_SUPABASE_URL</code> i{' '}
            <code className="rounded bg-royal-ink/10 px-1.5 py-0.5 text-sm">VITE_SUPABASE_ANON_KEY</code> u{' '}
            <code className="rounded bg-royal-ink/10 px-1.5 py-0.5 text-sm">.env</code> fajl (vidi .env.example), zatim
            restartuj dev server.
          </p>
        </div>
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-royal-charcoal">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!session) return <AdminLogin onError="" />;

  return (
    <div className="min-h-screen bg-royal-ivory">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-gold/20 bg-royal-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/Beli logo2.webp" alt="Kralj Residence" className="h-9" />
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Admin panel</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Tema sajta */}
            <div className="flex items-center gap-2">
              <span className="hidden text-xs uppercase tracking-wider text-white/50 lg:block">Tema sajta</span>
              <div className="flex rounded-full border border-gold/30 p-0.5">
                {(
                  [
                    ['light', 'Svetla', <Sun key="s" className="h-3.5 w-3.5" />],
                    ['dark', 'Tamna', <Moon key="m" className="h-3.5 w-3.5" />],
                  ] as const
                ).map(([id, label, icon]) => (
                  <button
                    key={id}
                    onClick={() => changeTheme(id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      theme === id ? 'bg-gold text-night' : 'text-gold/70 hover:text-gold'
                    }`}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <span className="hidden text-sm text-white/60 sm:block">{session.user.email}</span>
            <button
              onClick={() => supabase?.auth.signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition hover:bg-gold hover:text-royal-ink"
            >
              <LogOut className="h-3.5 w-3.5" />
              Odjava
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Tabovi */}
        {!selected && (
          <div className="mb-8 flex flex-wrap gap-2 rounded-full border border-royal-ink/10 bg-white p-1.5 shadow-royal-sm sm:w-fit">
            {(
              [
                ['buildings', 'Nekretnine'],
                ['home', 'Početna strana'],
                ['featured', 'Izdvajamo iz ponude'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition sm:flex-none ${
                  tab === id ? 'bg-royal-ink text-gold' : 'text-royal-stone hover:text-royal-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {selected ? (
          <ApartmentsManager building={selected} onBack={() => setSelected(null)} />
        ) : tab === 'featured' ? (
          <FeaturedManager />
        ) : tab === 'home' ? (
          <HomeManager buildings={buildings} onChanged={loadBuildings} />
        ) : (
          <BuildingsManager buildings={buildings} onChanged={loadBuildings} onOpenApartments={setSelected} />
        )}
      </main>
    </div>
  );
};

export default Admin;
