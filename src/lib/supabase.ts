import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Fallback vrednosti — koriste se kada hosting (Vercel) nema podešene env varijable.
 * Anon ključ je javan po dizajnu (uvek završi u frontend bundle-u); podatke čuva RLS u bazi.
 */
const FALLBACK_URL = 'https://kptfuttldocrqvjzmybp.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGZ1dHRsZG9jcnF2anpteWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Mjk4MTEsImV4cCI6MjEwMDMwNTgxMX0.OHvZ-HNHc2tLoDS9Ar1qjXTTp76XaRjGMZgwyqAaAyA';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

/** True kada su ključevi dostupni — sajt tada čita podatke iz baze. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
