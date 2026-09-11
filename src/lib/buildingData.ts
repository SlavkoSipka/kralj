import { isSupabaseConfigured } from './supabase';
import { fetchBuildingBySlug, fetchVisibleApartments, type Building, type ApartmentRow } from './buildingsApi';
import { VILLA5_STATIC } from '../constants/villa5Apartments';

export interface BuildingData {
  building: Building;
  apartments: ApartmentRow[];
}

/** Zgrade čiji su stanovi i u kodu, da bi stranice radile i dok podaci nisu uneti u bazu */
const STATIC_BUILDINGS: Record<string, BuildingData> = {
  'vila-5': VILLA5_STATIC,
};

/**
 * Zgrada i njeni vidljivi stanovi iz baze (admin panel). Ako baza nije dostupna ili zgrada još
 * nema unetih stanova, koriste se podaci iz koda kada postoje za taj slug.
 * Vraća null kada zgrada ne postoji ili je sakrivena u admin panelu.
 */
export async function loadBuildingData(slug: string): Promise<BuildingData | null> {
  const fallback = STATIC_BUILDINGS[slug] ?? null;
  if (!isSupabaseConfigured) return fallback;
  try {
    const building = await fetchBuildingBySlug(slug);
    if (!building) return fallback;
    if (!building.visible) return null;
    const apartments = await fetchVisibleApartments(building.id);
    return { building, apartments: apartments.length === 0 && fallback ? fallback.apartments : apartments };
  } catch {
    return fallback;
  }
}
