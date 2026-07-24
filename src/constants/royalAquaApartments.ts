// Apartment data by floor for Royal Aqua
export const ROYAL_AQUA_GROUND_FLOOR_APARTMENTS = [
  { id: 1, number: 1, size: 45.44, type: 'Jednosoban', image: "/images/royal/crtez/STAN 1.webp" },
  { id: 2, number: 2, size: 29.11, type: 'Jednosoban', image: "/images/royal/crtez/STAN 2.webp" },
  { id: 3, number: 3, size: 24.44, type: 'Garsonjera', image: "/images/royal/crtez/STAN 3.webp" },
  { id: 4, number: 4, size: 43.56, type: 'Jednosoban', image: "/images/royal/crtez/STAN 4.webp" }
] as const;

export const ROYAL_AQUA_FIRST_FLOOR_APARTMENTS = [
  { id: 5, number: 5, size: 36.01, type: 'Jednosoban', image: "/images/royal/crtez/STAN 5.webp" },
  { id: 6, number: 6, size: 36.62, type: 'Jednosoban', image: "/images/royal/crtez/STAN 6.webp" },
  { id: 7, number: 7, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 7.webp" },
  { id: 8, number: 8, size: 32.13, type: 'Jednosoban', image: "/images/royal/crtez/STAN 8.webp" },
  { id: 9, number: 9, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 9.webp" },
  { id: 10, number: 10, size: 36.62, type: 'Jednosoban', image: "/images/royal/crtez/STAN 10.webp" },
  { id: 11, number: 11, size: 36.01, type: 'Jednosoban', image: "/images/royal/crtez/STAN 11.webp" }
] as const;

export const ROYAL_AQUA_SECOND_FLOOR_APARTMENTS = [
  { id: 12, number: 12, size: 38.49, type: 'Jednosoban', image: "/images/royal/crtez/STAN 12.webp" },
  { id: 13, number: 13, size: 39.10, type: 'Jednosoban', image: "/images/royal/crtez/STAN 13.webp" },
  { id: 14, number: 14, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 14.webp" },
  { id: 15, number: 15, size: 32.13, type: 'Jednosoban', image: "/images/royal/crtez/STAN 15.webp" },
  { id: 16, number: 16, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 16.webp" },
  { id: 17, number: 17, size: 39.10, type: 'Jednosoban', image: "/images/royal/crtez/STAN 17.webp" },
  { id: 18, number: 18, size: 38.49, type: 'Jednosoban', image: "/images/royal/crtez/STAN 18.webp" }
] as const;

export const ROYAL_AQUA_THIRD_FLOOR_APARTMENTS = [
  { id: 19, number: 19, size: 38.49, type: 'Jednosoban', image: "/images/royal/crtez/STAN 19.webp" },
  { id: 20, number: 20, size: 39.10, type: 'Jednosoban', image: "/images/royal/crtez/STAN 20.webp" },
  { id: 21, number: 21, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 21.webp" },
  { id: 22, number: 22, size: 32.13, type: 'Jednosoban', image: "/images/royal/crtez/STAN 22.webp" },
  { id: 23, number: 23, size: 45.73, type: 'Dvosoban', image: "/images/royal/crtez/STAN 23.webp" },
  { id: 24, number: 24, size: 39.10, type: 'Jednosoban', image: "/images/royal/crtez/STAN 24.webp" },
  { id: 25, number: 25, size: 38.49, type: 'Jednosoban', image: "/images/royal/crtez/STAN 25.webp" }
] as const;

export const ROYAL_AQUA_PENTHOUSE_APARTMENTS = [
  { id: 26, number: 26, size: "65,33 + 70m²", type: 'Trosoban', image: "/images/royal/crtez/STAN 26.webp" },
  { id: 27, number: 27, size: "62,27 + 70m²", type: 'Dvosoban', image: "/images/royal/crtez/STAN 27.webp" }
] as const;

export const getFloorName = (apartmentNumber: number): string => {
  if (apartmentNumber <= 4) return 'Nisko prizemlje';
  if (apartmentNumber <= 11) return 'Visoko prizemlje';
  if (apartmentNumber <= 18) return 'Prvi sprat';
  if (apartmentNumber <= 25) return 'Drugi sprat';
  return 'Povučeni sprat';
};