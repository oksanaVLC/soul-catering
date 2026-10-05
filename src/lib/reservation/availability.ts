// Status of each day of the calendar. Pure function: the same code is used in the browser
// (and, in the future, the server will have to apply it again with the real availability).
import type {
  AvailabilityStatus,
  DayStatus,
  IsoDate,
  MonthAvailability,
  ReservationConfig,
} from '../../types/reservation.ts';
import { daysBetween, parseIsoDate } from '../dates.ts';

/** Status according to the availability data, or null if that month has no data. */
export function getAvailabilityStatus(
  date: IsoDate,
  availability: readonly MonthAvailability[],
): AvailabilityStatus | null {
  const parts = parseIsoDate(date);
  if (!parts) return null;
  const month = availability.find((m) => m.year === parts.year && m.month === parts.monthIndex);
  if (!month) return null;
  if (month.full.includes(parts.day)) return 'full';
  if (month.few.includes(parts.day)) return 'few';
  return 'available';
}

export interface DayContext {
  availability: readonly MonthAvailability[];
  config: Pick<ReservationConfig, 'minAdvanceDays' | 'maxAdvanceDays'>;
  /** Today's date (YYYY-MM-DD). It is a parameter so it can be tested. */
  today: IsoDate;
}

/**
 * Final status of a day: past days are never selectable; lead time applies only if
 * configured (today min/max = null: PENDING DECISION, no restriction).
 */
export function getDayStatus(date: IsoDate, ctx: DayContext): DayStatus {
  const base = getAvailabilityStatus(date, ctx.availability);
  if (base === null) return 'no-data';
  const diff = daysBetween(ctx.today, date);
  if (diff < 0) return 'past';
  const { minAdvanceDays, maxAdvanceDays } = ctx.config;
  if (minAdvanceDays !== null && diff < minAdvanceDays) return 'out-of-range';
  if (maxAdvanceDays !== null && diff > maxAdvanceDays) return 'out-of-range';
  return base;
}

export function isSelectable(status: DayStatus): boolean {
  return status === 'available' || status === 'few';
}
