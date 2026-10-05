// DEMO: calendar availability (design data). Not connected to any real calendar
// or database: in the future it will come from the server (the browser is not trusted).

import type { MonthAvailability } from '../types/reservation.ts';

/** Two months shown in the calendar (design: November and December 2026). */
export const availability: MonthAvailability[] = [
  { year: 2026, month: 10, full: [7, 14, 15, 21, 28], few: [6, 13, 20, 27] },
  { year: 2026, month: 11, full: [5, 12, 19, 24, 31], few: [11, 18, 26] },
];
