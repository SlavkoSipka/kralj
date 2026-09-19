/**
 * 360° virtuelni obilazak dvorišta (Insta360).
 *
 * Mapa (pogled odozgo): public/images/360/dvoriste-mapa.webp
 * Slika tačke N: public/images/360/panorame/tacka-N.webp (equirectangular, odnos 2:1)
 * Pozicije su očitane sa skice mape na kojoj su tačke ručno obeležene;
 * x i y su u procentima (x: 0 levo, 100 desno; y: 0 vrh, 100 dno).
 */

export interface PanoramaHotspot {
  id: string;
  /** Broj tačke na mapi i u plejeru */
  number: number;
  /** Horizontalna pozicija tačke na mapi, u procentima */
  x: number;
  /** Vertikalna pozicija tačke na mapi, u procentima */
  y: number;
  /** 360 slika tačke */
  image: string;
}

export const PANORAMA_MAP_IMAGE = '/images/360/dvoriste-mapa.webp';

/** Pozicije tačaka 1 do 7 na mapi: [x, y] */
const POSITIONS: [number, number][] = [
  [51.9, 64.0],
  [37.0, 60.5],
  [29.6, 30.2],
  [36.5, 20.8],
  [23.2, 29.5],
  [18.5, 28.9],
  [25.3, 40.0],
];

export const PANORAMA_HOTSPOTS: PanoramaHotspot[] = POSITIONS.map(([x, y], i) => ({
  id: `tacka-${i + 1}`,
  number: i + 1,
  x,
  y,
  image: `/images/360/panorame/tacka-${i + 1}.webp`,
}));
