// Centralized booking configuration. Without imports from Astro or the DOM (usable in tests).
// IMPORTANT: commercial values are DEMO. In a phase with real payments the server
// must recalculate all amounts; never trust what the browser sends.
import type { Lang, ReservationConfig, ReservationInput } from '../types/reservation.ts';

/** Deposit percentage. DEMO / PENDING DECISION (demo value: 30). */
export const DEPOSIT_PERCENT = 30;

/**
 * Children's menu price as a percentage of the adult price.
 * DEMO / PENDING DECISION: NOT approved. 50 is deduced from the formula of the design HTML
 * only so that the demo interface calculates a total. It is not a commercial rule.
 */
export const KIDS_PRICE_PERCENT = 50;

/**
 * Deposit rounding, in cents. 100 = whole euros, as the design does (6725 € → 2018 €).
 * DEMO / PENDING DECISION.
 */
export const DEPOSIT_ROUNDING_CENTS = 100;

/** Limits of the guest counter (design: 0–500). The commercial minimum is pending ([MÍNIMO DE INVITADOS]). */
export const GUESTS_MIN = 0;
export const GUESTS_MAX = 500;

/**
 * Minimum and maximum booking lead time, in days from today.
 * PENDING DECISION: no approved values. `null` = no restriction.
 */
export const MIN_ADVANCE_DAYS: number | null = null;
export const MAX_ADVANCE_DAYS: number | null = null;

/**
 * Required «Lugar» fields. PENDING DECISION: the design marks none as required.
 * Neutral value: address and city (without them the event cannot be located).
 */
export const REQUIRED_VENUE_FIELDS = ['address', 'city'] as const;

export const reservationConfig: ReservationConfig = {
  depositPercent: DEPOSIT_PERCENT,
  kidsPricePercent: KIDS_PRICE_PERCENT,
  depositRoundingCents: DEPOSIT_ROUNDING_CENTS,
  guestsMin: GUESTS_MIN,
  guestsMax: GUESTS_MAX,
  minAdvanceDays: MIN_ADVANCE_DAYS,
  maxAdvanceDays: MAX_ADVANCE_DAYS,
  requiredVenueFields: REQUIRED_VENUE_FIELDS,
};

/** Initial state of the booking form (design demo state). */
export const BOOKING_DEFAULTS: ReservationInput = {
  menuId: 'banquete',
  guests: { adults: 80, kids: 10 },
  date: '2026-11-06',
  startTime: '12:00',
  eventType: 'boda',
  venue: { address: '', city: 'Valencia', postalCode: '', space: 'interior' },
  extraIds: ['flor'],
  contact: { name: '', phone: '', email: '', language: 'es' },
  allergenIds: [],
  comments: '',
  acceptsPolicies: false,
};

export const LOCALE = 'es-ES';

/** Locale for dates and amounts in each language (prices are always in euros). */
const LOCALES: Record<Lang, string> = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', ru: 'ru-RU' };

export function localeFor(lang: Lang): string {
  return LOCALES[lang];
}
