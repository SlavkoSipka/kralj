import { STATUS } from './index';

/** Brojevi stanova koji su još uvek dostupni (ostali su prodati) — usklađeno sa klijentovim tabelama. */
const VILLA3_AVAILABLE = new Set([2, 7]);
const VILLA4_AVAILABLE = new Set([3, 5, 6, 22, 23]);
const ROYAL_AQUA_AVAILABLE = new Set([1, 4, 6, 10, 13, 17, 19, 20, 24, 25]);

export function isApartmentSold(pathname: string, apartmentNumber: number): boolean {
  if (pathname === '/villa-3') {
    return !VILLA3_AVAILABLE.has(apartmentNumber);
  }
  if (pathname === '/villa-4') {
    return !VILLA4_AVAILABLE.has(apartmentNumber);
  }
  if (pathname === '/royal-aqua') {
    return !ROYAL_AQUA_AVAILABLE.has(apartmentNumber);
  }
  return false;
}

export function apartmentStatusForPath(pathname: string, apartmentNumber: number): string {
  return isApartmentSold(pathname, apartmentNumber) ? STATUS.SOLD : STATUS.AVAILABLE;
}
