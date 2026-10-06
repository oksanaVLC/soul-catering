// DEMO: extras catalog. Copied from the design (Inicio and Servicios extra); texts in i18n
// (extra.<id>.title / .text / .alt, categories extraCat.<id>).
// It is NOT the definitive commercial catalog.
import type { ImageMetadata } from 'astro';
import dj from '../assets/images/dj.jpg';
import guitarra from '../assets/images/guitarra.jpg';
import lavanda from '../assets/images/lavanda.webp';
import maquillaje from '../assets/images/maquillaje.jpg';
import fotografa from '../assets/images/fotografa.jpg';
import botellaAgua from '../assets/images/botella-agua.jpg';
import mesaDulce from '../assets/images/mesa-dulce.jpg';
import sillaSombrero from '../assets/images/silla-sombrero.jpg';
import servilletaLazo from '../assets/images/servilleta-lazo.webp';

import type { T } from '../i18n/utils';

/** Category ids of the filters ('all' = every extra). */
export const extraCategories = ['all', 'musica', 'decoracion', 'belleza', 'foto', 'bebidas', 'personal', 'ninos'] as const;

export type ExtraCategory = Exclude<(typeof extraCategories)[number], 'all'>;

type ExtraBase = {
  id: string;
  cat: ExtraCategory;
  image?: ImageMetadata;
  /** SVG path (24×24) for extras without a photo («Foto pendiente»). */
  icon?: string;
};

export type Extra = ExtraBase & { catLabel: string; title: string; text: string; alt?: string };

const base: ExtraBase[] = [
  { id: 'dj', cat: 'musica', image: dj },
  { id: 'live', cat: 'musica', image: guitarra },
  { id: 'flor', cat: 'decoracion', image: lavanda },
  { id: 'mua', cat: 'belleza', image: maquillaje },
  { id: 'foto', cat: 'foto', image: fotografa },
  { id: 'bar', cat: 'bebidas', image: botellaAgua },
  { id: 'dulce', cat: 'decoracion', image: mesaDulce },
  { id: 'mob', cat: 'decoracion', image: sillaSombrero },
  { id: 'mantel', cat: 'decoracion', image: servilletaLazo },
  { id: 'luz', cat: 'decoracion', icon: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z' },
  { id: 'photocall', cat: 'foto', icon: 'M4 4h16v16H4zM8 15l3-3 2 2 3-4' },
  { id: 'kids', cat: 'ninos', icon: 'M12 3c3.3 0 6 2.7 6 6.2C18 13 15 16 12 16s-6-3-6-6.8C6 5.7 8.7 3 12 3zM12 16l-1 2h2zM12 18c0 1.5-1 2-1 3' },
  { id: 'staff', cat: 'personal', icon: 'M3 18h18M5 18a7 7 0 0 1 14 0M12 9V7M10 7h4' },
];

export function getExtras(t: T): Extra[] {
  return base.map((x) => ({
    ...x,
    catLabel: t(`extraCat.${x.cat}`),
    title: t(`extra.${x.id}.title`),
    text: t(`extra.${x.id}.text`),
    alt: x.image ? t(`extra.${x.id}.alt`) : undefined,
  }));
}

/** Inicio shows the first 8 (two full rows of 4 on large screens); the rest are on /extras. */
export const HOME_EXTRAS_COUNT = 8;

/** Extras selected at startup on /extras (design demo state). */
export const extrasInitiallySelected = ['flor'];

// The booking extras (step 5 of /reserva, with DEMO prices) are in booking-catalog.ts.
// PENDING DECISION — definitive extras catalog: they do not match this catalog.
