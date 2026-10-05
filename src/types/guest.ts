// Types for the guest panel. Prepared for a future API (simple JSON, no presentation).

/** Attendance of a guest. The visible text and colors are in the interface (i18n + StatusBadge). */
export type Attendance = 'confirmed' | 'pending' | 'declined';

export interface Guest {
  id: string;
  name: string;
  /** null if the guest has no email (e.g. children). */
  email: string | null;
  table: string;
  attendance: Attendance;
  /** Assigned menu (text from the design); null if not attending. */
  menu: string | null;
  /** Allergy/preference labels as they appear in the panel design (nomenclature: PENDING DECISION). */
  allergens: string[];
}

/** Panel filters (design: Todos, Confirmados, Pendientes, No asisten, Con alergias). */
export type GuestFilter = 'all' | Attendance | 'allergies';

export interface GuestCounts {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  withAllergies: number;
}

/** Event the guest list belongs to (header of the panel). */
export interface PanelEvent {
  /** Name shown in the breadcrumb («Boda [NOMBRES]»). */
  name: string;
  date: string;
  time: string;
  venue: string;
  menu: string;
  totalCents: number;
}
