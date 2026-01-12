import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ UPOZORENJE: Supabase environment varijable nisu postavljene!');
  console.warn('Potrebne varijable:');
  console.warn('- VITE_SUPABASE_URL:', supabaseUrl ? '✓ OK' : '✗ NEDOSTAJE');
  console.warn('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ OK' : '✗ NEDOSTAJE');
  console.warn('');
  console.warn('📖 Pogledaj NETLIFY-SETUP.md za uputstvo kako da ih postaviš');
  console.warn('Aplikacija će raditi u demo modu bez baze podataka.');
}

// Use dummy values if not configured (for development)
const finalUrl = supabaseUrl || 'https://dummy.supabase.co';
const finalKey = supabaseAnonKey || 'dummy-key';

export const supabase = createClient(finalUrl, finalKey);

