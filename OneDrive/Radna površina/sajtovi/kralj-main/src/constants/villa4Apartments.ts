// Apartment data by floor for Villa 4
export const VILLA4_GROUND_FLOOR_APARTMENTS = [
  { id: 1, number: 1, size: 43.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 1 - 7 - 13 - 19.png" },
  { id: 2, number: 2, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 3, number: 3, size: 39.83, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 3 - 9 - 15 - 21.png" }
] as const;

export const VILLA4_FIRST_FLOOR_APARTMENTS = [
  { id: 4, number: 4, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila4/stan 4 - 10 - 16..png" },
  { id: 5, number: 5, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 5 - 11 - 17.png" },
  { id: 6, number: 6, size: 38.78, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 6 - 12 - 18.png" },
  { id: 7, number: 7, size: 43.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 1 - 7 - 13 - 19.png" },
  { id: 8, number: 8, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 9, number: 9, size: 39.83, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 3 - 9 - 15 - 21.png" }
] as const;

export const VILLA4_SECOND_FLOOR_APARTMENTS = [
  { id: 10, number: 10, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila4/stan 4 - 10 - 16..png" },
  { id: 11, number: 11, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 5 - 11 - 17.png" },
  { id: 12, number: 12, size: 38.78, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 6 - 12 - 18.png" },
  { id: 13, number: 13, size: 43.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 1 - 7 - 13 - 19.png" },
  { id: 14, number: 14, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 15, number: 15, size: 39.83, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 3 - 9 - 15 - 21.png" }
] as const;

export const VILLA4_THIRD_FLOOR_APARTMENTS = [
  { id: 16, number: 16, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila4/stan 4 - 10 - 16..png" },
  { id: 17, number: 17, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 5 - 11 - 17.png" },
  { id: 18, number: 18, size: 38.78, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 6 - 12 - 18.png" },
  { id: 19, number: 19, size: 43.01, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 1 - 7 - 13 - 19.png" },
  { id: 20, number: 20, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 21, number: 21, size: 39.83, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 3 - 9 - 15 - 21.png" }
] as const;

export const VILLA4_PENTHOUSE_APARTMENTS = [
  { id: 22, number: 22, size: 25.27, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila4/stan 22.png" },
  { id: 23, number: 23, size: 38.52, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 23.png" },
  { id: 24, number: 24, size: 38.82, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 24.png" },
  { id: 25, number: 25, size: 44.37, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 25.png" },
  { id: 26, number: 26, size: 40.64, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 26.png" },
  { id: 27, number: 27, size: 39.73, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila4/stan 27.png" }
] as const;

export const getFloorName = (apartmentNumber: number): string => {
  if (apartmentNumber <= 3) return 'Nisko prizemlje';
  if (apartmentNumber <= 9) return 'Visoko prizemlje';
  if (apartmentNumber <= 15) return 'Prvi sprat';
  if (apartmentNumber <= 21) return 'Drugi sprat';
  return 'Povučeni sprat';
};