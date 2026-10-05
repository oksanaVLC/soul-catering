import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, multiplyCents, percentOfCents, sumCents } from './money.ts';

test('multiplyCents: unit price × quantity in integer cents', () => {
  assert.equal(multiplyCents(7500, 80), 600000);
  assert.equal(multiplyCents(2250, 0), 0);
});

test('multiplyCents rejects non-integer amounts (avoids decimal euros)', () => {
  assert.throws(() => multiplyCents(75.5, 2), RangeError);
  assert.throws(() => multiplyCents(7500, 1.5), RangeError);
});

test('percentOfCents: no floating-point error and rounding half up', () => {
  // Classic case: 0.1 + 0.2 does not appear because we work with integers.
  assert.equal(percentOfCents(672500, 30), 201750); // 2017,50 €
  assert.equal(percentOfCents(672500, 30, 100), 201800); // rounded to euros → 2018 €
  assert.equal(percentOfCents(4500, 50), 2250);
  assert.equal(percentOfCents(1, 50), 1); // 0,5 cents → 1 (half up)
  assert.equal(percentOfCents(0, 30, 100), 0);
});

test('sumCents adds integers', () => {
  assert.equal(sumCents([600000, 37500, 35000]), 672500);
  assert.equal(sumCents([]), 0);
});

test('formatCents: no decimals if whole, two if there are cents', () => {
  assert.equal(formatCents(672500), '6725 €');
  assert.equal(formatCents(419750), '4197,50 €');
  assert.equal(formatCents(120000, { grouping: true }), '1.200 €');
});
