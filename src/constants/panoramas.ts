/**
 * 360° virtuelni obilazak dvorišta (Insta360).
 *
 * KAKO DODATI SLIKE:
 * 1. Mapa (pogled odozgo): public/images/360/dvoriste-mapa.webp
 * 2. 360 slike (equirectangular, odnos 2:1, iz Insta360 exporta) ubaci u public/images/360/
 *    i upiši putanju u `image` tačke. Dok je `image` null, plejer za tu tačku prikazuje "uskoro".
 * 3. x i y su pozicija tačke na mapi u procentima (x: 0 levo, 100 desno; y: 0 vrh, 100 dno).
 */

export interface PanoramaHotspot {
  id: string;
  /** Naziv tačke (na mapi i u plejeru) */
  label: string;
  /** Horizontalna pozicija tačke na mapi, u procentima */
  x: number;
  /** Vertikalna pozicija tačke na mapi, u procentima */
  y: number;
  /** 360 slika; null dok slika ne bude dodata */
  image: string | null;
}

export const PANORAMA_MAP_IMAGE = '/images/360/dvoriste-mapa.webp';

export const PANORAMA_HOTSPOTS: PanoramaHotspot[] = [
  { id: 'bazen', label: 'Bazen', x: 32.6, y: 23.7, image: null },
  { id: 'vrt', label: 'Vrt sa fontanom', x: 23.3, y: 32.5, image: null },
  { id: 'dvoriste', label: 'Centralno dvorište', x: 34.2, y: 56.4, image: null },
  { id: 'parking', label: 'Parking', x: 46.6, y: 53.9, image: null },
  { id: 'ulaz', label: 'Ulaz u kompleks', x: 36.5, y: 74.8, image: null },
  { id: 'istocni-parking', label: 'Istočni parking', x: 65.3, y: 78.4, image: null },
];
