// Centralized money logic. All amounts are INTEGERS in cents:
// no decimal euros are ever multiplied, which avoids floating-point errors.
import type { Cents } from '../types/reservation.ts';

function assertCents(value: number, name: string): void {
  if (!Number.isSafeInteger(value)) throw new RangeError(`${name} must be an integer in cents: ${value}`);
}

/** Unit price × quantity (both integers). */
export function multiplyCents(unit: Cents, quantity: number): Cents {
  assertCents(unit, 'unit');
  if (!Number.isSafeInteger(quantity)) throw new RangeError(`quantity must be an integer: ${quantity}`);
  return unit * quantity;
}

/**
 * Percentage of an amount, rounded (half up) to a multiple of `roundingCents`.
 * E.g. percentOfCents(672500, 30, 100) → 201800 (2017,50 € rounded to whole euros).
 */
export function percentOfCents(amount: Cents, percent: number, roundingCents: Cents = 1): Cents {
  assertCents(amount, 'amount');
  assertCents(roundingCents, 'roundingCents');
  if (roundingCents <= 0) throw new RangeError('roundingCents must be greater than 0');
  // amount * percent is exact while both are integers; the only division is in the rounding.
  const raw = (amount * percent) / 100;
  return Math.round(raw / roundingCents) * roundingCents;
}

export function sumCents(values: readonly Cents[]): Cents {
  return values.reduce((acc, value) => {
    assertCents(value, 'value');
    return acc + value;
  }, 0);
}

/**
 * Amount without symbol: «6725» if there are no cents, «4197,50» if there are.
 * `grouping` adds the thousands separator (the platform mini-screen uses «1.200»).
 */
export function formatAmount(
  cents: Cents,
  { locale = 'es-ES', grouping = false }: { locale?: string; grouping?: boolean } = {},
): string {
  assertCents(cents, 'cents');
  const whole = cents % 100 === 0;
  return (cents / 100).toLocaleString(locale, {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
    useGrouping: grouping ? true : 'auto',
  } as Intl.NumberFormatOptions);
}

/** Presentation with symbol: «6725 €», «4197,50 €». */
export function formatCents(
  cents: Cents,
  { locale = 'es-ES', symbol = '€', grouping = false }: { locale?: string; symbol?: string; grouping?: boolean } = {},
): string {
  return `${formatAmount(cents, { locale, grouping })} ${symbol}`;
}
