// DEMO calculation of the booking summary. Pure function (no DOM, no Astro).
// IMPORTANT: it is guidance only and uses EXAMPLE prices. In a phase with real payments the
// server must recalculate these amounts with its own data; never trust the browser.
import type {
  ReservationCatalog,
  ReservationConfig,
  ReservationInput,
  ReservationSummary,
  SummaryLine,
} from '../../types/reservation.ts';
import { multiplyCents, percentOfCents, sumCents } from '../money.ts';

export function calculateSummary(
  input: ReservationInput,
  catalog: ReservationCatalog,
  config: ReservationConfig,
): ReservationSummary {
  const menu = catalog.menus.find((m) => m.id === input.menuId) ?? null;
  const extras = catalog.extras.filter((x) => input.extraIds.includes(x.id));
  const lines: SummaryLine[] = [];

  if (menu) {
    lines.push({
      id: 'adults',
      label: menu.name,
      quantity: input.guests.adults,
      unitCents: menu.pricePerAdultCents,
      totalCents: multiplyCents(menu.pricePerAdultCents, input.guests.adults),
    });
    // Children's price: DEMO / PENDING DECISION (percentage of the adult price).
    const kidUnit = percentOfCents(menu.pricePerAdultCents, config.kidsPricePercent);
    lines.push({
      id: 'kids',
      label: menu.name,
      quantity: input.guests.kids,
      unitCents: kidUnit,
      totalCents: multiplyCents(kidUnit, input.guests.kids),
    });
  }

  for (const extra of extras) {
    lines.push({
      id: `extra:${extra.id}`,
      label: extra.name,
      quantity: 1,
      unitCents: extra.priceCents,
      totalCents: extra.priceCents,
    });
  }

  const subtotalCents = sumCents(lines.map((line) => line.totalCents));
  // There are no taxes, fees or discounts defined: total = subtotal (PENDING DECISION if any appear).
  const totalCents = subtotalCents;
  const depositCents = percentOfCents(totalCents, config.depositPercent, config.depositRoundingCents);

  return {
    isDemo: true,
    menu,
    guests: { ...input.guests },
    date: input.date,
    venue: { ...input.venue },
    extras,
    lines,
    subtotalCents,
    totalCents,
    depositPercent: config.depositPercent,
    depositCents,
    restCents: totalCents - depositCents,
  };
}
