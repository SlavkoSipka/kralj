// Apartment data by floor for Royal Aqua
export const ROYAL_AQUA_GROUND_FLOOR_APARTMENTS = [
  { id: 1, number: 1, size: 45.44, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 1.png" },
  { id: 2, number: 2, size: 29.11, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 2.png" },
  { id: 3, number: 3, size: 24.44, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 3.png" },
  { id: 4, number: 4, size: 43.56, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 4.png" }
] as const;

export const ROYAL_AQUA_FIRST_FLOOR_APARTMENTS = [
  { id: 5, number: 5, size: 36.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 5.png" },
  { id: 6, number: 6, size: 36.62, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 6.png" },
  { id: 7, number: 7, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 7.png" },
  { id: 8, number: 8, size: 32.13, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 8.png" },
  { id: 9, number: 9, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 9.png" },
  { id: 10, number: 10, size: 36.62, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 10.png" },
  { id: 11, number: 11, size: 36.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 11.png" }
] as const;

export const ROYAL_AQUA_SECOND_FLOOR_APARTMENTS = [
  { id: 12, number: 12, size: 38.49, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 12.png" },
  { id: 13, number: 13, size: 39.10, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 13.png" },
  { id: 14, number: 14, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 14.png" },
  { id: 15, number: 15, size: 32.13, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 15.png" },
  { id: 16, number: 16, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 16.png" },
  { id: 17, number: 17, size: 39.10, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 17.png" },
  { id: 18, number: 18, size: 38.49, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 18.png" }
] as const;

export const ROYAL_AQUA_THIRD_FLOOR_APARTMENTS = [
  { id: 19, number: 19, size: 38.49, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 19.png" },
  { id: 20, number: 20, size: 39.10, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 20.png" },
  { id: 21, number: 21, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 21.png" },
  { id: 22, number: 22, size: 32.13, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 22.png" },
  { id: 23, number: 23, size: 45.73, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 23.png" },
  { id: 24, number: 24, size: 39.10, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 24.png" },
  { id: 25, number: 25, size: 38.49, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 25.png" }
] as const;

export const ROYAL_AQUA_PENTHOUSE_APARTMENTS = [
  { id: 26, number: 26, size: "65,33 + 70m²", type: 'Trosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 26.png" },
  { id: 27, number: 27, size: "62,27 + 70m²", type: 'Dvosoban', image: "http://aislike.rs/Kralj1/royal/crtez/STAN 27.png" }
] as const;

export const getFloorName = (apartmentNumber: number): string => {
  if (apartmentNumber <= 4) return 'Nisko prizemlje';
  if (apartmentNumber <= 11) return 'Visoko prizemlje';
  if (apartmentNumber <= 18) return 'Prvi sprat';
  if (apartmentNumber <= 25) return 'Drugi sprat';
  return 'Povučeni sprat';
};