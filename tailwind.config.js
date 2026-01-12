/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
      },
      colors: {
        gold: '#D4AF37',
        cream: {
          100: '#F5E6D3',
          200: '#E6D5C3',
        },
      },
    },
  },
  plugins: [],
};