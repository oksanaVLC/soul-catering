// Guest panel logic (filters, search, counters). Pure functions: no DOM or Astro.
// Works on DEMO data today; in the future it will receive the guests from the API.
import type { Guest, GuestCounts, GuestFilter } from '../../types/guest.ts';

export const GUEST_FILTERS: readonly GuestFilter[] = ['all', 'confirmed', 'pending', 'declined', 'allergies'];

export function matchesFilter(guest: Guest, filter: GuestFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'allergies') return guest.allergens.length > 0;
  return guest.attendance === filter;
}

/** Name search: case- and accent-insensitive («lucia» finds «Lucía»). */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export function matchesQuery(guest: Guest, query: string): boolean {
  const q = normalize(query);
  return q === '' || normalize(guest.name).includes(q);
}

export function filterGuests(guests: readonly Guest[], filter: GuestFilter, query: string): Guest[] {
  return guests.filter((guest) => matchesFilter(guest, filter) && matchesQuery(guest, query));
}

export function countGuests(guests: readonly Guest[]): GuestCounts {
  return {
    total: guests.length,
    confirmed: guests.filter((g) => g.attendance === 'confirmed').length,
    pending: guests.filter((g) => g.attendance === 'pending').length,
    declined: guests.filter((g) => g.attendance === 'declined').length,
    withAllergies: guests.filter((g) => g.allergens.length > 0).length,
  };
}
