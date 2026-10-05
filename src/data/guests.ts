// DEMO: example guests and event, copied from the panel design (design/06 and its HTML).
// These are NOT real clients nor persistent data: reloading the page returns this state.
// PENDING DECISION — definitive allergen nomenclature: here «Marisco» appears (as in the
// panel design); the booking uses «Crustáceos y moluscos».
import type { Guest, PanelEvent } from '../types/guest.ts';

export const demoEvent: PanelEvent = {
  name: 'Boda [NOMBRES]',
  date: '2026-11-06',
  time: '13:00',
  venue: '[FINCA], Valencia · Exterior',
  menu: 'Banquete',
  // Example total from the design (4.000 €). The amount paid is calculated with the DEMO deposit.
  totalCents: 400000,
};

export const demoGuests: Guest[] = [
  { id: 'g01', name: 'Carmen López', email: 'carmen.l@email.com', table: '1', attendance: 'confirmed', menu: 'Adulto', allergens: ['Gluten'] },
  { id: 'g02', name: 'Javier Martín', email: 'javier.m@email.com', table: '1', attendance: 'confirmed', menu: 'Adulto', allergens: [] },
  { id: 'g03', name: 'Lucía Fernández', email: 'lucia.f@email.com', table: '2', attendance: 'confirmed', menu: 'Vegetariano', allergens: ['Frutos secos'] },
  { id: 'g04', name: 'Pablo Ruiz', email: 'pablo.r@email.com', table: '2', attendance: 'pending', menu: 'Adulto', allergens: [] },
  { id: 'g05', name: 'Anna Petrova', email: 'anna.p@email.com', table: '3', attendance: 'confirmed', menu: 'Adulto', allergens: ['Lácteos', 'Huevo'] },
  { id: 'g06', name: 'Claire Dubois', email: 'claire.d@email.com', table: '3', attendance: 'pending', menu: 'Adulto', allergens: [] },
  { id: 'g07', name: 'Martina Ruiz', email: null, table: '2', attendance: 'confirmed', menu: 'Infantil', allergens: ['Huevo'] },
  { id: 'g08', name: 'Miguel Torres', email: 'miguel.t@email.com', table: '4', attendance: 'declined', menu: null, allergens: [] },
  { id: 'g09', name: 'Sofía Navarro', email: 'sofia.n@email.com', table: '4', attendance: 'confirmed', menu: 'Adulto', allergens: ['Marisco'] },
  { id: 'g10', name: 'Daniel García', email: 'daniel.g@email.com', table: '5', attendance: 'pending', menu: 'Adulto', allergens: [] },
  { id: 'g11', name: 'Isabel Romero', email: 'isabel.r@email.com', table: '5', attendance: 'confirmed', menu: 'Sin gluten', allergens: ['Gluten'] },
  { id: 'g12', name: 'Marc Puig', email: 'marc.p@email.com', table: '1', attendance: 'confirmed', menu: 'Adulto', allergens: [] },
];
