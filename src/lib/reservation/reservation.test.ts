// Booking logic tests. IMPORTANT: the prices, the children's percentage (50 %) and the deposit
// (30 %) are DEMO values from the design; the tests check the CALCULATION, not a commercial rule.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { ReservationConfig, ReservationInput, MonthAvailability } from '../../types/reservation.ts';
import { bookingCatalog } from '../../data/booking-catalog.ts';
import { BOOKING_DEFAULTS, reservationConfig } from '../../data/config.ts';
import { calculateSummary } from './summary.ts';
import { getAvailabilityStatus, getDayStatus, isSelectable } from './availability.ts';
import { validateReservation, validateField, type ValidationContext } from './validation.ts';
import { createReservationStore } from './store.ts';
import { buildReservationRequest } from './submit.ts';

const availability: MonthAvailability[] = [
  { year: 2026, month: 10, full: [7, 14, 15, 21, 28], few: [6, 13, 20, 27] },
  { year: 2026, month: 11, full: [5, 12, 19, 24, 31], few: [11, 18, 26] },
];
const config: ReservationConfig = { ...reservationConfig };
const ctx: ValidationContext = {
  catalog: bookingCatalog,
  config,
  availability,
  today: '2026-10-05',
  languages: ['es', 'en', 'fr', 'ru'],
};
const base = (patch: Partial<ReservationInput> = {}): ReservationInput => ({
  ...structuredClone(BOOKING_DEFAULTS),
  ...patch,
});
const valid = (): ReservationInput =>
  base({
    venue: { address: 'Calle Demo 1', city: 'Valencia', postalCode: '', space: 'interior' },
    contact: { name: 'Ana Demo', phone: '600 000 000', email: 'ana@example.com', language: 'es' },
    acceptsPolicies: true,
  });

describe('calculateSummary (DEMO calculation)', () => {
  test('initial design state: 80 adults + 10 kids, Banquete, Floristería → 6725 €', () => {
    const s = calculateSummary(base(), bookingCatalog, config);
    assert.equal(s.isDemo, true);
    assert.equal(s.subtotalCents, 672500);
    assert.equal(s.totalCents, 672500);
    assert.equal(s.depositCents, 201800); // 30 % DEMO, rounded to euros DEMO → 2018 €
    assert.equal(s.restCents, 470700);
    assert.equal(s.depositCents + s.restCents, s.totalCents);
  });

  test('adults only: price per adult × adults', () => {
    const s = calculateSummary(base({ guests: { adults: 10, kids: 0 }, extraIds: [] }), bookingCatalog, config);
    assert.equal(s.subtotalCents, 75000);
  });

  test('kids: DEMO percentage of the adult price (50 % not approved)', () => {
    const s = calculateSummary(base({ guests: { adults: 0, kids: 2 }, extraIds: [] }), bookingCatalog, config);
    assert.equal(s.lines.find((l) => l.id === 'kids')?.unitCents, 3750);
    assert.equal(s.subtotalCents, 7500);
    const other = calculateSummary(base({ guests: { adults: 0, kids: 2 }, extraIds: [] }), bookingCatalog, {
      ...config,
      kidsPricePercent: 100,
    });
    assert.equal(other.subtotalCents, 15000, 'the percentage is configurable');
  });

  test('extras: their DEMO prices are added; unknown ids are ignored', () => {
    const s = calculateSummary(
      base({ guests: { adults: 0, kids: 0 }, extraIds: ['flor', 'foto', 'no-existe'] }),
      bookingCatalog,
      config,
    );
    assert.equal(s.subtotalCents, 95000);
    assert.deepEqual(s.extras.map((x) => x.id), ['flor', 'foto']);
  });

  test('changing the menu changes the total', () => {
    const banquet = calculateSummary(base(), bookingCatalog, config).totalCents;
    const cocktail = calculateSummary(base({ menuId: 'coctel' }), bookingCatalog, config).totalCents;
    assert.equal(cocktail, 4500 * 80 + 2250 * 10 + 35000);
    assert.notEqual(banquet, cocktail);
  });

  test('cents: 45 € × 50 % × 11 kids gives 0,50 € that are not lost', () => {
    const s = calculateSummary(base({ menuId: 'coctel', guests: { adults: 80, kids: 11 } }), bookingCatalog, config);
    assert.equal(s.subtotalCents, 360000 + 24750 + 35000); // 4197,50 €
    assert.equal(s.depositCents + s.restCents, s.totalCents);
  });

  test('configurable deposit (DEMO): another percentage and rounding to cents', () => {
    const s = calculateSummary(base(), bookingCatalog, { ...config, depositPercent: 25, depositRoundingCents: 1 });
    assert.equal(s.depositCents, 168125);
  });

  test('no menu: only extras count', () => {
    const s = calculateSummary(base({ menuId: null }), bookingCatalog, config);
    assert.equal(s.menu, null);
    assert.equal(s.subtotalCents, 35000);
  });
});

describe('availability', () => {
  test('statuses from the DEMO data', () => {
    assert.equal(getAvailabilityStatus('2026-11-07', availability), 'full');
    assert.equal(getAvailabilityStatus('2026-11-06', availability), 'few');
    assert.equal(getAvailabilityStatus('2026-11-09', availability), 'available');
    assert.equal(getAvailabilityStatus('2027-01-10', availability), null);
  });

  test('past days and months without data are not selectable', () => {
    const c = { availability, config, today: '2026-11-10' };
    assert.equal(getDayStatus('2026-11-09', c), 'past');
    assert.equal(getDayStatus('2026-11-10', c), 'available');
    assert.equal(getDayStatus('2027-01-10', c), 'no-data');
    assert.equal(isSelectable('past'), false);
    assert.equal(isSelectable('few'), true);
    assert.equal(isSelectable('full'), false);
  });

  test('lead time: null = no restriction (PENDING DECISION); configurable', () => {
    const open = { availability, config, today: '2026-11-01' };
    assert.equal(getDayStatus('2026-11-02', open), 'available');
    const limited = { availability, config: { ...config, minAdvanceDays: 7, maxAdvanceDays: 30 }, today: '2026-11-01' };
    assert.equal(getDayStatus('2026-11-02', limited), 'out-of-range');
    assert.equal(getDayStatus('2026-11-09', limited), 'available');
    assert.equal(getDayStatus('2026-12-17', limited), 'out-of-range');
  });
});

describe('validation', () => {
  test('a complete booking has no errors', () => {
    assert.deepEqual(validateReservation(valid(), ctx), []);
  });

  test('missing required data (initial state of the form)', () => {
    const fields = validateReservation(base(), ctx).map((e) => `${e.field}:${e.code}`);
    assert.deepEqual(fields, ['address:required', 'name:required', 'phone:required', 'email:required', 'policies:required']);
  });

  test('menu not selected or not existing', () => {
    assert.equal(validateReservation({ ...valid(), menuId: null }, ctx)[0]?.code, 'required');
    assert.equal(validateReservation({ ...valid(), menuId: 'x' }, ctx)[0]?.code, 'unknown-option');
  });

  test('invalid guests: none, negatives, decimals or above the maximum', () => {
    const codes = (guests: ReservationInput['guests']) =>
      validateField({ ...valid(), guests }, 'guests', ctx).map((e) => e.code);
    assert.deepEqual(codes({ adults: 0, kids: 0 }), ['required']);
    assert.deepEqual(codes({ adults: -1, kids: 0 }), ['out-of-limits']);
    assert.deepEqual(codes({ adults: 1.5, kids: 0 }), ['out-of-limits']);
    assert.deepEqual(codes({ adults: 501, kids: 0 }), ['out-of-limits']);
    assert.deepEqual(codes({ adults: 0, kids: 3 }), []);
  });

  test('date not selected, full or past', () => {
    assert.equal(validateField({ ...valid(), date: null }, 'date', ctx)[0]?.code, 'required');
    assert.equal(validateField({ ...valid(), date: '2026-11-07' }, 'date', ctx)[0]?.code, 'date-unavailable');
    assert.equal(validateField(valid(), 'date', { ...ctx, today: '2026-12-01' })[0]?.code, 'date-unavailable');
  });

  test('email and phone with invalid format', () => {
    const v = valid();
    assert.equal(validateField({ ...v, contact: { ...v.contact, email: 'ana@' } }, 'email', ctx)[0]?.code, 'invalid');
    assert.equal(validateField({ ...v, contact: { ...v.contact, phone: '12' } }, 'phone', ctx)[0]?.code, 'invalid');
  });

  test('required «Lugar» fields come from the configuration (PENDING DECISION)', () => {
    const v = { ...valid(), venue: { ...valid().venue, address: '', postalCode: '' } };
    assert.deepEqual(validateReservation(v, ctx).map((e) => e.field), ['address']);
    const strict = { ...ctx, config: { ...config, requiredVenueFields: ['address', 'city', 'postalCode'] as const } };
    assert.deepEqual(validateReservation(v, strict).map((e) => e.field), ['address', 'postalCode']);
  });

  test('every error indicates its section (1–6)', () => {
    for (const e of validateReservation({ ...base(), menuId: null, date: null }, ctx)) {
      assert.ok(e.step >= 1 && e.step <= 6);
    }
  });
});

describe('store (single source of truth)', () => {
  test('changing data recalculates the derived summary', () => {
    const store = createReservationStore({ ...ctx, initial: base() });
    const totals: number[] = [];
    store.subscribe((_, s) => totals.push(s.totalCents));
    store.selectMenu('mixto');
    store.changeGuests('adults', 1);
    store.setExtra('foto', true);
    assert.equal(store.getSummary().totalCents, 9000 * 81 + 4500 * 10 + 35000 + 60000);
    assert.equal(totals.length, 4); // initial + 3 changes
  });

  test('guests are clamped to the configured limits', () => {
    const store = createReservationStore({ ...ctx, initial: base() });
    store.setGuests('kids', -5);
    store.setGuests('adults', 9999);
    assert.deepEqual(store.getState().input.guests, { adults: 500, kids: 0 });
  });

  test('statuses: editing → invalid → (correction) → request-received, sending nothing', async () => {
    const sent: unknown[] = [];
    const store = createReservationStore({
      ...ctx,
      initial: base(),
      submit: async (request) => {
        sent.push(request);
        return { ok: true, demo: true, status: 'request-received', reference: 'TEST' };
      },
    });
    assert.equal(store.getState().status, 'editing');
    const failed = await store.submit();
    assert.equal(failed.ok, false);
    assert.equal(store.getState().status, 'invalid');
    assert.equal(sent.length, 0);

    store.updateVenue({ address: 'Calle Demo 1' });
    store.updateContact({ name: 'Ana', phone: '600000000', email: 'ana@example.com' });
    assert.deepEqual(store.getState().errors.map((e) => e.field), ['policies'], 'the errors are updated');
    store.setAcceptsPolicies(true);
    assert.equal(store.getState().status, 'editing');

    const ok = await store.submit();
    assert.equal(ok.ok, true);
    assert.equal(store.getState().status, 'request-received');
    assert.equal(sent.length, 1);
    store.backToEditing();
    assert.equal(store.getState().status, 'editing');
  });

  test('the request sent does NOT include prices or amounts', () => {
    const request = buildReservationRequest(valid());
    const json = JSON.stringify(request);
    assert.ok(!/price|cents|total|deposit/i.test(json), json);
    assert.throws(() => buildReservationRequest(base({ acceptsPolicies: false })));
  });
});
