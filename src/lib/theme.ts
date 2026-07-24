import { supabase, isSupabaseConfigured } from './supabase';

export type SiteTheme = 'light' | 'dark';

const STORAGE_KEY = 'kralj-theme';

export const applyTheme = (theme: SiteTheme) => {
  document.documentElement.classList.toggle('theme-dark', theme === 'dark');
};

export const getCachedTheme = (): SiteTheme =>
  localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';

export const fetchTheme = async (): Promise<SiteTheme> => {
  if (!isSupabaseConfigured) return getCachedTheme();
  const { data } = await supabase!
    .from('site_settings')
    .select('value')
    .eq('key', 'theme')
    .maybeSingle();
  return data?.value === 'dark' ? 'dark' : 'light';
};

/** Odmah primeni keširanu temu (bez treperenja), zatim sinhronizuj sa bazom. */
export const initTheme = () => {
  applyTheme(getCachedTheme());
  if (!isSupabaseConfigured) return;
  fetchTheme()
    .then((theme) => {
      localStorage.setItem(STORAGE_KEY, theme);
      // Admin panel forsira svetlu temu dok je otvoren — ne diraj klasu tamo
      if (!window.location.pathname.startsWith('/admin')) applyTheme(theme);
    })
    .catch(() => undefined);
};

export const saveTheme = async (theme: SiteTheme) => {
  localStorage.setItem(STORAGE_KEY, theme);
  if (!isSupabaseConfigured) return;
  const { error } = await supabase!
    .from('site_settings')
    .upsert({ key: 'theme', value: theme, updated_at: new Date().toISOString() });
  if (error) throw error;
};
