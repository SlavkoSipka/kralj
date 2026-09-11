// Animation timing constants
export const ANIMATION_DELAYS = {
  LOADING: 900,
  MODAL_SLIDE: 400,
  FADE: 250,
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

/** Podrazumevani opis stana (popup i stranica stana) kada opis nije unet u admin panelu */
export const DEFAULT_APARTMENT_DESCRIPTION =
  'Ovaj stan u Kralj Residence nudi savršen spoj funkcionalnosti i luksuza. Sa pažljivo osmišljenim rasporedom i kvalitetnim materijalima, predstavlja idealan izbor za vrhunski životni prostor u srcu Vrnjačke Banje.';

// Apartment data
export const SAMPLE_APARTMENT = {
  id: 1,
  name: "Stan Broj 2 - Jednosoban",
  size: 40.98,
  rooms: 1,
  floor: "Nisko prizemlje",
  image: "https://res.cloudinary.com/duvwf75cx/image/upload/f_auto,q_auto,w_1920/v1739396173/Nenaslovljeni_dizajn_p0ljiz.png",
  status: "Dostupno",
  hasBalcony: true,
} as const;