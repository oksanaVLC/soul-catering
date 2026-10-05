// Phase 4 tests: guest panel (DEMO data from the design) and DEMO access (no authentication).
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { demoEvent, demoGuests } from '../../data/guests.ts';
import { formatMediumDate } from '../dates.ts';
import { countGuests, filterGuests, GUEST_FILTERS, matchesQuery } from './guests.ts';
import {
  DEMO_PANEL_PATH,
  demoRegister,
  demoSignIn,
  validateLogin,
} from '../access/demo-access.ts';

describe('demo guests (panel design data)', () => {
  test('12 guests with unique id and a valid status', () => {
    assert.equal(demoGuests.length, 12);
    assert.equal(new Set(demoGuests.map((g) => g.id)).size, 12);
    for (const g of demoGuests) {
      assert.ok(['confirmed', 'pending', 'declined'].includes(g.attendance), g.id);
      assert.ok(Array.isArray(g.allergens));
    }
  });

  test('event date in the design format: «Viernes, 6 nov. 2026»', () => {
    assert.equal(formatMediumDate(demoEvent.date), 'Viernes, 6 nov. 2026');
  });

  test('counters as in the design: 12 / 8 / 3 / 6 with allergies', () => {
    assert.deepEqual(countGuests(demoGuests), { total: 12, confirmed: 8, pending: 3, declined: 1, withAllergies: 6 });
  });
});

describe('filters and search', () => {
  test('each filter returns the expected guests', () => {
    const n = (f: (typeof GUEST_FILTERS)[number]) => filterGuests(demoGuests, f, '').length;
    assert.equal(n('all'), 12);
    assert.equal(n('confirmed'), 8);
    assert.equal(n('pending'), 3);
    assert.equal(n('declined'), 1);
    assert.equal(n('allergies'), 6);
  });

  test('search by name ignoring case and accents', () => {
    assert.deepEqual(filterGuests(demoGuests, 'all', 'lucia').map((g) => g.name), ['Lucía Fernández']);
    assert.deepEqual(filterGuests(demoGuests, 'all', '  RUIZ ').map((g) => g.id), ['g04', 'g07']);
    assert.equal(matchesQuery(demoGuests[0], ''), true);
  });

  test('filter + search combined, and empty result', () => {
    assert.deepEqual(filterGuests(demoGuests, 'pending', 'ruiz').map((g) => g.id), ['g04']);
    assert.equal(filterGuests(demoGuests, 'declined', 'carmen').length, 0);
  });
});

describe('DEMO access (no real authentication)', () => {
  test('validates the login format', () => {
    assert.deepEqual(validateLogin({ email: '', password: '' }).map((e) => `${e.field}:${e.code}`), ['email:required', 'password:required']);
    assert.deepEqual(validateLogin({ email: 'gestor@', password: 'x' }).map((e) => e.code), ['invalid']);
  });

  test('with a valid format it goes to the example panel (localized), without checking credentials', () => {
    const r = demoSignIn({ email: 'gestor@example.com', password: 'cualquiera' });
    assert.deepEqual(r, { ok: true, demo: true, redirectTo: DEMO_PANEL_PATH });
    const en = demoSignIn({ email: 'gestor@example.com', password: 'x' }, (p) => `/en${p}`);
    assert.equal(en.ok && en.redirectTo, '/en/panel/invitados');
  });

  test('the result does not contain the email or the password', () => {
    const r = demoSignIn({ email: 'gestor@example.com', password: 'secreta-123' });
    assert.ok(!JSON.stringify(r).includes('secreta-123'));
    assert.ok(!JSON.stringify(r).includes('gestor@example.com'));
  });

  test('«Crear cuenta» only validates (minimum 8 characters, as the design states); it does not create anything', () => {
    assert.deepEqual(
      demoRegister({ name: '', email: 'a@b.co', password: '1234567', acceptsPrivacy: false }).errors.map((e) => `${e.field}:${e.code}`),
      ['name:required', 'password:too-short', 'privacy:required'],
    );
    assert.deepEqual(demoRegister({ name: 'Ana', email: 'a@b.co', password: '12345678', acceptsPrivacy: true }), {
      ok: true,
      demo: true,
      errors: [],
    });
  });
});
