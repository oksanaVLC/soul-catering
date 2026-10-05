// Booking types. Prepared to travel to an API later (simple JSON:
// strings, integers in cents, ISO dates). Without logic or dependencies on Astro/DOM.
import type { Lang } from '../i18n/utils.ts';

export type { Lang };

/** Integer amount in cents (avoids floating-point errors). */
export type Cents = number;

/** Date in YYYY-MM-DD format, with no time or time zone. */
export type IsoDate = string;

// ── Catalog (DEMO data today; a definitive source in the future) ──

export interface Menu {
  id: string;
  name: string;
  description: string;
  /** Price per adult. DEMO. */
  pricePerAdultCents: Cents;
}

export interface Extra {
  id: string;
  name: string;
  /** Fixed price per event. DEMO. */
  priceCents: Cents;
}

export interface Allergen {
  id: string;
  /** Label as it appears in the design (nomenclature: PENDING DECISION). */
  label: string;
}

export interface ReservationCatalog {
  menus: readonly Menu[];
  extras: readonly Extra[];
  startTimes: readonly string[];
  eventTypes: readonly string[];
  allergens: readonly Allergen[];
}

// ── Availability ──

/** Status of a day according to the availability data. */
export type AvailabilityStatus = 'available' | 'few' | 'full';

/** Final status of a day for the user (adds the date rules). */
export type DayStatus = AvailabilityStatus | 'past' | 'out-of-range' | 'no-data';

export interface MonthAvailability {
  year: number;
  /** 0 = January */
  month: number;
  full: number[];
  few: number[];
}

// ── Data entered by the user ──

/** Guest counts by group (the individual guest list will come with the panel). */
export interface Guests {
  adults: number;
  kids: number;
}

export type GuestGroup = keyof Guests;

export type SpaceType = 'interior' | 'exterior';

export interface Venue {
  address: string;
  city: string;
  postalCode: string;
  space: SpaceType;
}

export interface ContactDetails {
  name: string;
  phone: string;
  email: string;
  language: Lang;
}

/** Everything the user enters. It contains NO prices or calculated data. */
export interface ReservationInput {
  menuId: string | null;
  guests: Guests;
  date: IsoDate | null;
  startTime: string;
  eventType: string;
  venue: Venue;
  extraIds: string[];
  contact: ContactDetails;
  allergenIds: string[];
  comments: string;
  acceptsPolicies: boolean;
}

// ── Configuration ──

export type VenueField = 'address' | 'city' | 'postalCode';

export interface ReservationConfig {
  depositPercent: number;
  /** Children's price as a percentage of the adult price. DEMO / PENDING DECISION. */
  kidsPricePercent: number;
  /** Deposit rounding, in cents (100 = whole euros). DEMO / PENDING DECISION. */
  depositRoundingCents: Cents;
  guestsMin: number;
  guestsMax: number;
  minAdvanceDays: number | null;
  maxAdvanceDays: number | null;
  requiredVenueFields: readonly VenueField[];
}

// ── Calculated data ──

export interface SummaryLine {
  id: string;
  label: string;
  quantity: number;
  unitCents: Cents;
  totalCents: Cents;
}

/** Derived from ReservationInput + catalog + config. Never stored. */
export interface ReservationSummary {
  /** Always true while the prices are example prices. */
  isDemo: true;
  menu: Menu | null;
  guests: Guests;
  date: IsoDate | null;
  venue: Venue;
  extras: Extra[];
  lines: SummaryLine[];
  subtotalCents: Cents;
  totalCents: Cents;
  depositPercent: number;
  depositCents: Cents;
  restCents: Cents;
}

// ── Validation ──

export type ReservationField =
  | 'menu'
  | 'guests'
  | 'date'
  | 'startTime'
  | 'eventType'
  | 'address'
  | 'city'
  | 'postalCode'
  | 'extras'
  | 'name'
  | 'phone'
  | 'email'
  | 'language'
  | 'policies';

export type ValidationCode =
  | 'required'
  | 'invalid'
  | 'unknown-option'
  | 'out-of-limits'
  | 'date-unavailable';

export interface ReservationValidationError {
  field: ReservationField;
  code: ValidationCode;
  /** Booking section (1–6) where the field is. */
  step: 1 | 2 | 3 | 4 | 5 | 6;
}

// ── States and submission ──

/**
 * Internal states of the booking on this page.
 * Approved future sequence (NOT implemented): request received → email → deposit payment;
 * the date is locked when the deposit payment is received.
 */
export type ReservationStatus = 'editing' | 'invalid' | 'submitting' | 'request-received';

/** What would be sent to the future backend: user data only, never prices. */
export interface ReservationRequest {
  menuId: string;
  guests: Guests;
  date: IsoDate;
  startTime: string;
  eventType: string;
  venue: Venue;
  extraIds: string[];
  contact: ContactDetails;
  allergenIds: string[];
  comments: string;
  acceptsPolicies: true;
}

export type SubmitResult =
  | { ok: true; demo: true; reference: string; status: 'request-received' }
  | { ok: false; demo: true; reason: 'invalid' };
