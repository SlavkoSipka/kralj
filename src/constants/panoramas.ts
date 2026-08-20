/**
 * 360° panorame dvorišta (Insta360).
 *
 * KAKO DODATI SLIKE:
 * 1. Ubaci ortofoto dvorišta (pogled odozgo) u:  public/images/360/dvoriste-mapa.webp
 * 2. Ubaci 360 slike (equirectangular JPG iz Insta360 exporta) u:  public/images/360/
 * 3. Dodaj/izmeni tačke ispod — x i y su pozicija tačke na mapi u procentima
 *    (x: 0 = levo, 100 = desno; y: 0 = vrh, 100 = dno).
 *
 * Sekcija na početnoj se automatski sakriva dok mapa ne postoji.
 */

export interface PanoramaHotspot {
  id: string;
  /** Naziv koji se prikazuje u vieweru i na hover tačke */
  label: string;
  /** Horizontalna pozicija tačke na mapi (0–100 %) */
  x: number;
  /** Vertikalna pozicija tačke na mapi (0–100 %) */
  y: number;
  /** Putanja do 360 slike */
  image: string;
}

export const PANORAMA_ORTHO_IMAGE = '/images/360/dvoriste-mapa.webp';

export const PANORAMA_HOTSPOTS: PanoramaHotspot[] = [
  { id: 'tacka-1', label: 'Centar dvorišta', x: 50, y: 50, image: '/images/360/tacka-1.jpg' },
  { id: 'tacka-2', label: 'Kod bazena', x: 30, y: 40, image: '/images/360/tacka-2.jpg' },
  { id: 'tacka-3', label: 'Ulaz u kompleks', x: 70, y: 70, image: '/images/360/tacka-3.jpg' },
];
