// Centralized booking validation. Pure function: it returns codes, not texts
// (the texts are in i18n). The future server will have to validate again.
import type {
  IsoDate,
  MonthAvailability,
  ReservationCatalog,
  ReservationConfig,
  ReservationField,
  ReservationInput,
  ReservationValidationError,
  ValidationCode,
} from '../../types/reservation.ts';
import { getDayStatus, isSelectable } from './availability.ts';
import { isValidEmail } from '../email.ts';

export interface ValidationContext {
  catalog: ReservationCatalog;
  config: ReservationConfig;
  availability: readonly MonthAvailability[];
  today: IsoDate;
  /** Accepted contact languages (from i18n). */
  languages: readonly string[];
}

/** Section of the page where each field is (for the error summary). */
export const FIELD_STEP: Record<ReservationField, ReservationValidationError['step']> = {
  menu: 1,
  guests: 2,
  date: 3,
  startTime: 3,
  eventType: 3,
  address: 4,
  city: 4,
  postalCode: 4,
  extras: 5,
  name: 6,
  phone: 6,
  email: 6,
  language: 6,
  policies: 6,
};

const PHONE_CHARS_RE = /^[+\d\s().-]+$/;

export function validateReservation(
  input: ReservationInput,
  ctx: ValidationContext,
): ReservationValidationError[] {
  const errors: ReservationValidationError[] = [];
  const add = (field: ReservationField, code: ValidationCode) =>
    errors.push({ field, code, step: FIELD_STEP[field] });
  const blank = (value: string) => value.trim() === '';

  // 1. Menu
  if (input.menuId === null) add('menu', 'required');
  else if (!ctx.catalog.menus.some((m) => m.id === input.menuId)) add('menu', 'unknown-option');

  // 2. Guests (the commercial minimum is a PENDING DECISION: here only at least 1)
  const { adults, kids } = input.guests;
  const { guestsMin, guestsMax } = ctx.config;
  const okCount = (n: number) => Number.isInteger(n) && n >= guestsMin && n <= guestsMax;
  if (!okCount(adults) || !okCount(kids)) add('guests', 'out-of-limits');
  else if (adults + kids < 1) add('guests', 'required');

  // 3. Date, time and event type
  if (input.date === null) add('date', 'required');
  else if (!isSelectable(getDayStatus(input.date, ctx))) add('date', 'date-unavailable');
  if (!ctx.catalog.startTimes.includes(input.startTime)) add('startTime', 'unknown-option');
  if (!ctx.catalog.eventTypes.includes(input.eventType)) add('eventType', 'unknown-option');

  // 4. Venue (required fields: configurable, PENDING DECISION)
  for (const field of ctx.config.requiredVenueFields) {
    if (blank(input.venue[field])) add(field, 'required');
  }

  // 5. Extras (only those in the catalog)
  if (input.extraIds.some((id) => !ctx.catalog.extras.some((x) => x.id === id))) {
    add('extras', 'unknown-option');
  }

  // 6. Contact details
  const { name, phone, email, language } = input.contact;
  if (blank(name)) add('name', 'required');
  if (blank(phone)) add('phone', 'required');
  else if (!PHONE_CHARS_RE.test(phone) || phone.replace(/\D/g, '').length < 6) add('phone', 'invalid');
  if (blank(email)) add('email', 'required');
  else if (!isValidEmail(email)) add('email', 'invalid');
  if (!ctx.languages.includes(language)) add('language', 'unknown-option');
  if (!input.acceptsPolicies) add('policies', 'required');

  return errors;
}

/** Errors of a single field (to validate on leaving that field). */
export function validateField(
  input: ReservationInput,
  field: ReservationField,
  ctx: ValidationContext,
): ReservationValidationError[] {
  return validateReservation(input, ctx).filter((error) => error.field === field);
}
