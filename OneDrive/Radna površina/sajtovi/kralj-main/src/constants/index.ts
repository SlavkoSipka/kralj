// Animation timing constants
export const ANIMATION_DELAYS = {
  LOADING: 1800,
  MODAL_SLIDE: 500,
  FADE: 300,
} as const;

// Style constants
export const COLORS = {
  PRIMARY: '#D4AF37',
  BACKGROUND: '#1A1614',
  TEXT: '#F5E6D3',
} as const;

// Status types
export const STATUS = {
  AVAILABLE: 'Dostupno',
  SOLD: 'Prodato',
} as const;

// Apartment data
export const SAMPLE_APARTMENT = {
  id: 1,
  name: "Stan Broj 2 - Jednosoban",
  size: 40.98,
  rooms: 1,
  floor: "Nisko prizemlje",
  image: "https://res.cloudinary.com/duvwf75cx/image/upload/v1739396173/Nenaslovljeni_dizajn_p0ljiz.png",
  status: "Dostupno",
  hasBalcony: true,
} as const;