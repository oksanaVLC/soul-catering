// DEMO: extras catalog. Copied from the design (Inicio and Servicios extra).
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

export const extraCategories = [
  'Todos',
  'Música',
  'Decoración',
  'Belleza',
  'Foto y vídeo',
  'Bebidas',
  'Personal',
  'Niños',
] as const;

export type ExtraCategory = Exclude<(typeof extraCategories)[number], 'Todos'>;

export type Extra = {
  id: string;
  cat: ExtraCategory;
  title: string;
  text: string;
  image?: ImageMetadata;
  alt?: string;
  /** SVG path (24×24) for extras without a photo («Foto pendiente»). */
  icon?: string;
};

export const extras: Extra[] = [
  { id: 'dj', cat: 'Música', title: 'DJ y equipo de sonido', text: 'Música para el cóctel, el baile y la recena, con micrófono para los discursos.', image: dj, alt: 'DJ pinchando con auriculares' },
  { id: 'live', cat: 'Música', title: 'Música en directo', text: 'Cuarteto de cuerda, saxo o grupo para la ceremonia y el aperitivo.', image: guitarra, alt: 'Músico tocando la guitarra española' },
  { id: 'flor', cat: 'Decoración', title: 'Floristería', text: 'Centros de mesa, ramos y decoración floral básica o premium.', image: lavanda, alt: 'Lavanda en macetas sobre una mesa' },
  { id: 'mua', cat: 'Belleza', title: 'Maquillaje y peluquería', text: 'Equipo profesional para novios, familia e invitados el mismo día.', image: maquillaje, alt: 'Maquilladora maquillando a una novia' },
  { id: 'foto', cat: 'Foto y vídeo', title: 'Fotografía y vídeo', text: 'Cobertura básica, completa o vídeo profesional del evento.', image: fotografa, alt: 'Fotógrafa con cámara réflex' },
  { id: 'bar', cat: 'Bebidas', title: 'Barra libre y cócteles', text: 'Barra con bartender, cócteles de autor y opciones sin alcohol.', image: botellaAgua, alt: 'Botella de cristal y vaso de agua' },
  { id: 'dulce', cat: 'Decoración', title: 'Mesa dulce y tarta', text: 'Tarta personalizada y postres en formato mini.', image: mesaDulce, alt: 'Porciones de tarta sobre blondas' },
  { id: 'mob', cat: 'Decoración', title: 'Mobiliario y carpas', text: 'Mesas, sillas, sofás chill-out y carpas para exterior.', image: sillaSombrero, alt: 'Silla de madera con un sombrero' },
  { id: 'mantel', cat: 'Decoración', title: 'Mantelería y menaje', text: 'Mantelería de lino, cristalería y vajilla a juego con tu estilo.', image: servilletaLazo, alt: 'Servilleta de lino con lazo' },
  { id: 'luz', cat: 'Decoración', title: 'Iluminación ambiental', text: 'Guirnaldas, velas y luz cálida para la noche.', icon: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z' },
  { id: 'photocall', cat: 'Foto y vídeo', title: 'Photocall', text: 'Fondo decorado y accesorios para fotos divertidas.', icon: 'M4 4h16v16H4zM8 15l3-3 2 2 3-4' },
  { id: 'kids', cat: 'Niños', title: 'Animación infantil', text: 'Monitores, juegos y rincón infantil mientras los mayores disfrutan.', icon: 'M12 3c3.3 0 6 2.7 6 6.2C18 13 15 16 12 16s-6-3-6-6.8C6 5.7 8.7 3 12 3zM12 16l-1 2h2zM12 18c0 1.5-1 2-1 3' },
  { id: 'staff', cat: 'Personal', title: 'Camareros y coordinador', text: 'Personal extra de sala y un coordinador que dirige el evento.', icon: 'M3 18h18M5 18a7 7 0 0 1 14 0M12 9V7M10 7h4' },
];

/** Extras selected at startup on /extras (design demo state). */
export const extrasInitiallySelected = ['flor'];

// The booking extras (step 5 of /reserva, with DEMO prices) are in booking-catalog.ts.
// PENDING DECISION — definitive extras catalog: they do not match this catalog.
