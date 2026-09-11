import { supabase } from './supabase';

export type BuildingStatus = 'Dostupno' | 'Prodato' | 'Uskoro';

export interface Building {
  id: string;
  slug: string;
  name: string;
  eyebrow: string | null;
  description: string | null;
  image_url: string | null;
  size_label: string | null;
  features: string[];
  status: BuildingStatus;
  visible: boolean;
  sort_order: number;
  total_apartments: number | null;
  /** Prikaz kao velika sekcija na početnoj stranici */
  featured_home: boolean;
  home_sort: number;
  /** SEO naslov sekcije na početnoj (fallback: naziv zgrade) */
  home_title: string | null;
}

export interface ApartmentRow {
  id: string;
  building_id: string;
  number: number;
  type: string;
  size_label: string;
  floor_name: string;
  card_image_url: string | null;
  plan_image_url: string | null;
  /** PDF osnova za stranicu stana */
  pdf_url: string | null;
  outdoor_label: string;
  /** Vrednost spoljnog prostora na kartici ("2.32 m²", "Ne"); null = "Da" */
  outdoor_value: string | null;
  description: string | null;
  sold: boolean;
  visible: boolean;
  featured: boolean;
  sort_order: number;
}

export interface FeaturedApartment extends ApartmentRow {
  buildings: { name: string; slug: string; visible: boolean; status: BuildingStatus };
}

/** Slugovi koji imaju svoje stare (legacy) rute — sve ostale idu na /zgrada/:slug */
const LEGACY_ROUTES: Record<string, string> = {
  'villa-3': '/villa-3',
  'villa-4': '/villa-4',
  'vila-5': '/vila-5',
  'royal-aqua': '/royal-aqua',
};

export const buildingPath = (slug: string) => LEGACY_ROUTES[slug] ?? `/zgrada/${slug}`;

/** Stari projekti otvaraju stan u popup-u; Vila V i svi novi projekti imaju posebnu stranicu za svaki stan. */
const POPUP_APARTMENT_BUILDINGS = new Set(['vila-1', 'vila-2', 'villa-3', 'villa-4', 'royal-aqua']);

export const hasApartmentPages = (slug: string) => !POPUP_APARTMENT_BUILDINGS.has(slug);

/** Link ka stanu: posebna stranica (/vila-5/stan-12) ili popup na stranici zgrade (/villa-4?stan=12) */
export const apartmentPath = (slug: string, number: number) =>
  hasApartmentPages(slug) ? `${buildingPath(slug)}/stan-${number}` : `${buildingPath(slug)}?stan=${number}`;

// ---------- Javno čitanje ----------

export async function fetchVisibleBuildings(): Promise<Building[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Building[];
}

export async function fetchBuildingBySlug(slug: string): Promise<Building | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('buildings').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return (data as Building) ?? null;
}

export async function fetchVisibleApartments(buildingId: string): Promise<ApartmentRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('building_id', buildingId)
    .eq('visible', true)
    .order('sort_order', { ascending: true })
    .order('number', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ApartmentRow[];
}

/** Istaknuti stanovi za sekciju "Izdvajamo iz ponude" (bez rasprodatih zgrada). */
export async function fetchFeaturedApartments(): Promise<FeaturedApartment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('apartments')
    .select('*, buildings!inner(name, slug, visible, status)')
    .eq('featured', true)
    .eq('visible', true)
    .eq('buildings.visible', true)
    .neq('buildings.status', 'Prodato')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as FeaturedApartment[];
}

/** Stanovi svih aktivnih zgrada za admin tab "Izdvajamo iz ponude" (rasprodate zgrade se ne nude). */
export async function fetchAllApartmentsWithBuilding(): Promise<FeaturedApartment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('apartments')
    .select('*, buildings!inner(name, slug, visible, status)')
    .neq('buildings.status', 'Prodato')
    .order('building_id')
    .order('number');
  if (error) throw error;
  return (data ?? []) as FeaturedApartment[];
}

// ---------- Admin ----------

export async function fetchAllBuildings(): Promise<Building[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('buildings').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as Building[];
}

export async function fetchAllApartments(buildingId: string): Promise<ApartmentRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('building_id', buildingId)
    .order('sort_order')
    .order('number');
  if (error) throw error;
  return (data ?? []) as ApartmentRow[];
}

export async function upsertBuilding(building: Partial<Building> & { slug: string; name: string }) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { data, error } = await supabase.from('buildings').upsert(building, { onConflict: 'slug' }).select().single();
  if (error) throw error;
  return data as Building;
}

export async function updateBuilding(id: string, patch: Partial<Building>) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { error } = await supabase.from('buildings').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteBuilding(id: string) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { error } = await supabase.from('buildings').delete().eq('id', id);
  if (error) throw error;
}

export async function insertApartment(apartment: Omit<ApartmentRow, 'id'>) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { error } = await supabase.from('apartments').insert(apartment);
  if (error) throw error;
}

export async function updateApartment(id: string, patch: Partial<ApartmentRow>) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { error } = await supabase.from('apartments').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteApartment(id: string) {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const { error } = await supabase.from('apartments').delete().eq('id', id);
  if (error) throw error;
}

/** Upload slike u Supabase Storage; vraća javni URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error('Supabase nije konfigurisan');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
