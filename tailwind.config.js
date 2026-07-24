/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        // Boje kroz CSS varijable — tema se menja klasom .theme-dark na <html> (vidi index.css)
        // Accent (10%) — royal gold
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          deep: 'rgb(var(--c-gold-deep) / <alpha-value>)',
          soft: 'rgb(var(--c-gold-soft) / <alpha-value>)',
        },
        // Neutrals (60% / 30%)
        royal: {
          ink: 'rgb(var(--c-ink) / <alpha-value>)',       // primarni tekst na svetlom (invertuje se u tamnoj temi)
          charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',  // dark section bg
          espresso: 'rgb(var(--c-espresso) / <alpha-value>)',  // dark card bg
          stone: 'rgb(var(--c-stone) / <alpha-value>)',     // muted text
          sand: 'rgb(var(--c-sand) / <alpha-value>)',      // alt bg
          ivory: 'rgb(var(--c-ivory) / <alpha-value>)',     // main bg
        },
        cream: {
          100: '#F5E6D3',
          200: '#E6D5C3',
        },
        // Površina kartica (belo u svetloj, tamno u tamnoj temi)
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        // Uvek najtamnija boja, NE menja se sa temom (navbar, footer, overlay preko slika, tekst na zlatnom)
        night: '#17120E',
      },
      // Typescale — major third (1.25)
      fontSize: {
        'ts-p':  ['1.25rem',  { lineHeight: '1.7' }],      // 20
        'ts-h6': ['1.375rem', { lineHeight: '1.45', letterSpacing: '-0.005em' }],  // 22
        'ts-h5': ['1.5625rem',{ lineHeight: '1.35', letterSpacing: '-0.01em' }],  // 25
        'ts-h4': ['1.9531rem',{ lineHeight: '1.3', letterSpacing: '-0.01em' }],   // 31
        'ts-h3': ['2.4414rem',{ lineHeight: '1.2', letterSpacing: '-0.015em' }],  // 39
        'ts-h2': ['3.0518rem',{ lineHeight: '1.1', letterSpacing: '-0.018em' }],  // 49
        'ts-h1': ['3.8147rem',{ lineHeight: '1.0', letterSpacing: '-0.02em' }],   // 61
      },
      letterSpacing: {
        tightest: '-0.02em',
        luxe: '0.2em',
      },
      boxShadow: {
        royal: '0 24px 60px -20px rgba(23, 18, 14, 0.35)',
        'royal-sm': '0 12px 30px -12px rgba(23, 18, 14, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
