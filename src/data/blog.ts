// DEMO: blog listing data (titles, summaries and dates from the design).
// The articles do not exist: /blog/[slug] is pending, so the cards have no link.
import type { ImageMetadata } from 'astro';
import sobresAceitunas from '../assets/images/sobres-aceitunas.jpg';
import canapesTeteras from '../assets/images/canapes-teteras.jpg';
import bandejaEspejo from '../assets/images/bandeja-espejo.webp';
import tartaletas from '../assets/images/tartaletas.webp';
import mesaDulce from '../assets/images/mesa-dulce.jpg';
import canapesRemolacha from '../assets/images/canapes-remolacha.webp';
import brochetasFruta from '../assets/images/brochetas-fruta.jpg';
import servilletaLazo from '../assets/images/servilleta-lazo.webp';

export const blogCategories = [
  'Todos',
  'Bodas',
  'Empresa',
  'Planificación',
  'Alérgenos',
  'Recetas',
] as const;

export type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  minutes: number;
  image: ImageMetadata;
  /** Decorative image in the design (alt=""), except the featured one. */
  alt: string;
  date?: string;
};

export const featuredPost: Post = {
  slug: 'cuanta-comida-por-invitado',
  category: 'Planificación',
  title: 'Cuánta comida calcular por invitado en una boda',
  excerpt:
    'Cóctel, banquete y recena: cómo repartir las cantidades según la hora y la duración de la celebración.',
  minutes: 6,
  image: canapesTeteras,
  alt: 'Bandeja de canapés variados',
  date: '2026-09-18',
};

export const posts: Post[] = [
  { slug: 'alergias-invitados', category: 'Alérgenos', title: 'Cómo gestionamos las alergias de tus invitados', excerpt: 'Del formulario de invitados a la cocina: el recorrido de cada alergia.', minutes: 5, image: tartaletas, alt: '' },
  { slug: 'coctel-o-banquete', category: 'Formatos', title: 'Cóctel o banquete: qué formato elegir', excerpt: 'Ventajas de cada uno según invitados, espacio y horario.', minutes: 4, image: bandejaEspejo, alt: '' },
  { slug: 'mesa-dulce-comuniones', category: 'Comuniones', title: 'Mesa dulce para comuniones: ideas que funcionan', excerpt: 'Cantidades, presentación y opciones sin gluten.', minutes: 5, image: mesaDulce, alt: '' },
  { slug: 'checklist-empresa', category: 'Empresa', title: 'Catering para eventos de empresa: lista de comprobación', excerpt: 'Todo lo que conviene decidir antes de pedir presupuesto.', minutes: 7, image: canapesRemolacha, alt: '' },
  { slug: 'fruta-temporada-verano', category: 'Temporada', title: 'Fruta de temporada en eventos de verano', excerpt: 'Bocados frescos que aguantan bien al aire libre.', minutes: 4, image: brochetasFruta, alt: '' },
  { slug: 'degustacion-boda', category: 'Bodas', title: 'La degustación: qué preguntar y qué probar', excerpt: 'Una guía para aprovechar la prueba de menú.', minutes: 6, image: servilletaLazo, alt: '' },
];

/** The 3 posts of the Inicio block (design). */
export const homePosts: Post[] = [
  { slug: 'confirmar-asistencia', category: 'Invitados', title: 'Cómo confirmar asistencia sin perseguir a nadie', minutes: 5, image: sobresAceitunas, alt: '' },
  { slug: 'cuanta-comida-por-invitado', category: 'Planificación', title: 'Cuánta comida calcular por invitado en una boda', minutes: 6, image: canapesTeteras, alt: '' },
  { slug: 'coctel-o-banquete', category: 'Formatos', title: 'Cóctel o banquete: qué formato elegir', minutes: 4, image: bandejaEspejo, alt: '' },
];
