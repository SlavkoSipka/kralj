// Apartment data by floor
export const GROUND_FLOOR_APARTMENTS = [
  { id: 1, number: 1, size: 36.04, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 1-4-10-16.png" },
  { id: 2, number: 2, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 2-8-14-20.png" },
  { id: 3, number: 3, size: 45.48, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/vila3/stan 3-6-12-18.png" }
] as const;

export const FIRST_FLOOR_APARTMENTS = [
  { id: 4, number: 4, size: 36.04, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 1-4-10-16.png" },
  { id: 5, number: 5, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 6, number: 6, size: 45.48, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/vila3/stan 3-6-12-18.png" },
  { id: 7, number: 7, size: 38.71, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 7 - 13 - 19.png" },
  { id: 8, number: 8, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 2-8-14-20.png" },
  { id: 9, number: 9, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila3/stan 9-15-21.png" }
] as const;

export const SECOND_FLOOR_APARTMENTS = [
  { id: 10, number: 10, size: 36.04, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 1-4-10-16.png" },
  { id: 11, number: 11, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 12, number: 12, size: 45.48, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/vila3/stan 3-6-12-18.png" },
  { id: 13, number: 13, size: 38.71, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 7 - 13 - 19.png" },
  { id: 14, number: 14, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 2-8-14-20.png" },
  { id: 15, number: 15, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila3/stan 9-15-21.png" }
] as const;

export const THIRD_FLOOR_APARTMENTS = [
  { id: 16, number: 16, size: 36.04, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 1-4-10-16.png" },
  { id: 17, number: 17, size: 40.98, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 5-11-17.png" },
  { id: 18, number: 18, size: 45.48, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/vila3/stan 3-6-12-18.png" },
  { id: 19, number: 19, size: 38.71, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 7 - 13 - 19.png" },
  { id: 20, number: 20, size: 38.41, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 2-8-14-20.png" },
  { id: 21, number: 21, size: 25.00, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila3/stan 9-15-21.png" }
] as const;

export const getFloorName = (apartmentNumber: number): string => {
  if (apartmentNumber <= 3) return 'Nisko prizemlje';
  if (apartmentNumber <= 9) return 'Visoko prizemlje';
  if (apartmentNumber <= 15) return 'Prvi sprat';
  if (apartmentNumber <= 27) return 'Povučeni sprat';
};

export const PENTHOUSE_APARTMENTS = [
  { id: 22, number: 22, size: 36.68, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 22.png" },
  { id: 23, number: 23, size: 40.64, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 23.png" },
  { id: 24, number: 24, size: 45.82, type: 'Dvosoban', image: "http://aislike.rs/Kralj1/vila3/stan 24.png" },
  { id: 25, number: 25, size: 38.82, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 25.png" },
  { id: 26, number: 26, size: 38.52, type: 'Jednosoban', image: "http://aislike.rs/Kralj1/vila3/stan 26.png" },
  { id: 27, number: 27, size: 24.77, type: 'Garsonjera', image: "http://aislike.rs/Kralj1/vila3/stan 27.png" }
] as const;