import type { ApartmentRow, Building } from '../lib/buildingsApi';

/**
 * Vila V u kodu: isti podaci kao u bazi (supabase/migration-vila5.sql).
 * Koriste se dok stanovi nisu uneti u bazu ili kada baza nije dostupna, pa sajt izgleda isto u oba slučaja.
 * Tip, površina i terasa su iz PDF lista svakog stana. Stanovi sa istim rasporedom (npr. 4, 11 i 18)
 * dele 3D prikaz, osnovu i PDF. Slike i PDF-ove pravi scripts/compress-vila5.py.
 */
const DIR = '/images/vila5';

/** Isto kao red 'vila-5' u tabeli buildings */
const building: Building = {
  id: 'vila-5',
  slug: 'vila-5',
  name: 'Vila V',
  eyebrow: 'Novo · Počela prodaja',
  description:
    'Nastavak projekta Kralj Residence Resort. Novo uređeno dvorište, sopstveni bazen i 30 luksuznih stanova. Prodaja je počela, direktno od investitora.',
  image_url: '/images/vila-5.webp',
  size_label: '1400 m²',
  features: ['Privatni bazen', 'Uređeno dvorište', 'Parking'],
  status: 'Dostupno',
  visible: true,
  sort_order: 1,
  total_apartments: 30,
  featured_home: true,
  home_sort: 1,
  home_title: 'Novogradnja stanova u Vrnjačkoj Banji',
};

/** [broj, tip, površina, sprat, terasa, 3D prikaz, list stana (osnova i PDF)] */
const ROWS: [number, string, string, string, string, string, string][] = [
  [1, 'Trosoban', '57.87 m²', 'Suteren', 'Ne', '1-3', '1'],
  [2, 'Dvosoban', '37.14 m²', 'Suteren', 'Ne', '2', '2'],
  [3, 'Trosoban', '56.33 m²', 'Suteren', 'Ne', '1-3', '3'],
  [4, 'Dvosoban', '31.48 m²', 'Prizemlje', '1.52 m²', '4-11-18', '4-11-18'],
  [5, 'Dvosoban', '34.53 m²', 'Prizemlje', '2.32 m²', '5-12-19', '5-12-19'],
  [6, 'Dvosoban', '37.45 m²', 'Prizemlje', '2.15 m²', '6-13-20', '6-13-20'],
  [7, 'Dvosoban', '36.12 m²', 'Prizemlje', '2.34 m²', '7-14-21', '7-14-21'],
  [8, 'Dvosoban', '37.52 m²', 'Prizemlje', '2.22 m²', '8-15-22', '8-15-22'],
  [9, 'Dvosoban', '34.53 m²', 'Prizemlje', '2.32 m²', '9-16-23', '9-16-23'],
  [10, 'Dvosoban', '31.48 m²', 'Prizemlje', '1.52 m²', '10-17-24', '10-17-24'],
  [11, 'Dvosoban', '31.48 m²', 'Prvi sprat', '1.52 m²', '4-11-18', '4-11-18'],
  [12, 'Dvosoban', '34.53 m²', 'Prvi sprat', '2.32 m²', '5-12-19', '5-12-19'],
  [13, 'Dvosoban', '37.45 m²', 'Prvi sprat', '2.15 m²', '6-13-20', '6-13-20'],
  [14, 'Dvosoban', '36.12 m²', 'Prvi sprat', '2.34 m²', '7-14-21', '7-14-21'],
  [15, 'Dvosoban', '37.52 m²', 'Prvi sprat', '2.22 m²', '8-15-22', '8-15-22'],
  [16, 'Dvosoban', '34.53 m²', 'Prvi sprat', '2.32 m²', '9-16-23', '9-16-23'],
  [17, 'Dvosoban', '31.48 m²', 'Prvi sprat', '1.52 m²', '10-17-24', '10-17-24'],
  [18, 'Dvosoban', '31.48 m²', 'Drugi sprat', '1.52 m²', '4-11-18', '4-11-18'],
  [19, 'Dvosoban', '34.53 m²', 'Drugi sprat', '2.32 m²', '5-12-19', '5-12-19'],
  [20, 'Dvosoban', '37.45 m²', 'Drugi sprat', '2.15 m²', '6-13-20', '6-13-20'],
  [21, 'Dvosoban', '36.12 m²', 'Drugi sprat', '2.34 m²', '7-14-21', '7-14-21'],
  [22, 'Dvosoban', '37.52 m²', 'Drugi sprat', '2.22 m²', '8-15-22', '8-15-22'],
  [23, 'Dvosoban', '34.53 m²', 'Drugi sprat', '2.32 m²', '9-16-23', '9-16-23'],
  [24, 'Dvosoban', '31.48 m²', 'Drugi sprat', '1.52 m²', '10-17-24', '10-17-24'],
  // Povučeni sprat ima samo neprohodne terase, pa se ne računaju kao terasa
  [25, 'Dvosoban', '25.09 m²', 'Povučeni sprat', 'Ne', '25', '25'],
  [26, 'Jednosoban', '23.09 m²', 'Povučeni sprat', 'Ne', '26', '26'],
  [27, 'Trosoban', '49.86 m²', 'Povučeni sprat', 'Ne', '27-28', '27'],
  [28, 'Trosoban', '49.86 m²', 'Povučeni sprat', 'Ne', '27-28', '28'],
  [29, 'Jednosoban', '23.09 m²', 'Povučeni sprat', 'Ne', '29', '29'],
  [30, 'Dvosoban', '25.09 m²', 'Povučeni sprat', 'Ne', '30', '30'],
];

const apartments: ApartmentRow[] = ROWS.map(([number, type, size_label, floor_name, outdoor_value, image3d, sheet]) => ({
  id: `vila-5-${number}`,
  building_id: building.id,
  number,
  type,
  size_label,
  floor_name,
  card_image_url: `${DIR}/3d/stan-${image3d}.webp`,
  plan_image_url: `${DIR}/osnove/stan-${sheet}.webp`,
  pdf_url: `${DIR}/pdf/stan-${sheet}.pdf`,
  outdoor_label: 'Terasa',
  outdoor_value,
  description: null,
  sold: false,
  visible: true,
  featured: false,
  sort_order: number,
}));

export const VILLA5_STATIC = { building, apartments };
