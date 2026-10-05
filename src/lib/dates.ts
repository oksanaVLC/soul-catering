// «Calendar» dates (YYYY-MM-DD) with no time or time zone, so they don't shift a day.
import type { IsoDate } from '../types/reservation.ts';

export function toIsoDate(year: number, monthIndex: number, day: number): IsoDate {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Today's date in local time, as YYYY-MM-DD. */
export function todayIso(now: Date = new Date()): IsoDate {
  return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

export function parseIsoDate(iso: IsoDate): { year: number; monthIndex: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return { year, monthIndex: month - 1, day };
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  if (!a || !b) throw new RangeError(`invalid date: ${from} / ${to}`);
  const msA = Date.UTC(a.year, a.monthIndex, a.day);
  const msB = Date.UTC(b.year, b.monthIndex, b.day);
  return Math.round((msB - msA) / 86_400_000);
}

/** «Viernes, 6 de noviembre de 2026». */
export function formatLongDate(iso: IsoDate, locale = 'es-ES'): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  const text = new Date(Date.UTC(parts.year, parts.monthIndex, parts.day)).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * «Viernes, 6 nov. 2026» (abbreviated month with a period, as in the panel design).
 * Built from parts: with the weekday the engine would insert «de» («6 de nov. de 2026»).
 * The period is added only when the month is abbreviated («mayo» does not get one).
 */
export function formatMediumDate(iso: IsoDate, locale = 'es-ES'): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  const date = new Date(Date.UTC(parts.year, parts.monthIndex, parts.day));
  const opts = { timeZone: 'UTC' } as const;
  const weekday = date.toLocaleDateString(locale, { ...opts, weekday: 'long' });
  const long = date.toLocaleDateString(locale, { ...opts, month: 'long' });
  const dayMonthYear = new Intl.DateTimeFormat(locale, { ...opts, day: 'numeric', month: 'short', year: 'numeric' })
    .formatToParts(date)
    .map((p) => (p.type === 'month' && p.value !== long && !p.value.endsWith('.') ? `${p.value}.` : p.value))
    .join('');
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${dayMonthYear}`;
}
