// DEMO booking catalog: data from the design (/reserva). Prices in cents, EXAMPLE values.
// No images or Astro dependencies: usable in tests and, in the future, replaceable by a
// definitive source (API/CMS) without touching the components.
//
// PENDING DECISION — definitive extras catalog: these 3 extras do not match the
// /extras catalog (src/data/extras.ts) nor the table of /servicios/bodas.
// PENDING DECISION — definitive allergen nomenclature: «Crustáceos y moluscos» here,
// «Marisco» in the mini-screen of the platform (Inicio).
import type { ReservationCatalog } from '../types/reservation.ts';

export const bookingCatalog: ReservationCatalog = {
  menus: [
    { id: 'coctel', name: 'Cóctel', description: 'Bocados fríos y calientes, servidos de pie', pricePerAdultCents: 4500 },
    { id: 'banquete', name: 'Banquete', description: 'Entrante, principal y postre en mesa', pricePerAdultCents: 7500 },
    { id: 'mixto', name: 'Cóctel + banquete', description: 'Bienvenida de pie y comida en mesa', pricePerAdultCents: 9000 },
  ],
  extras: [
    { id: 'flor', name: 'Floristería · centros de mesa', priceCents: 35000 },
    { id: 'foto', name: 'Fotografía · cobertura básica', priceCents: 60000 },
    { id: 'staff', name: 'Coordinador de evento', priceCents: 25000 },
  ],
  startTimes: ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
  /** Ids; the visible texts are in i18n (eventType.*). */
  eventTypes: ['boda', 'empresa', 'privada', 'comunion', 'otro'],
  allergens: [
    { id: 'gluten', label: 'Gluten' },
    { id: 'lacteos', label: 'Lácteos' },
    { id: 'huevo', label: 'Huevo' },
    { id: 'frutos-secos', label: 'Frutos secos' },
    { id: 'cacahuete', label: 'Cacahuete' },
    { id: 'marisco', label: 'Crustáceos y moluscos' },
    { id: 'pescado', label: 'Pescado' },
    { id: 'soja', label: 'Soja' },
    { id: 'sesamo', label: 'Sésamo' },
    { id: 'otros', label: 'Otros (mostaza, apio…)' },
  ],
};
