// DEMO: blog listing data (titles, summaries and dates from the design). Texts in i18n:
// post.<slug>.title / .excerpt / .alt and categories blogCat.<id>.
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

import type { T } from '../i18n/utils';

/** Category ids of the filter ('all' = every article). */
export const blogCategories = ['all', 'bodas', 'empresa', 'planificacion', 'alergenos', 'recetas'] as const;

type PostBase = {
  slug: string;
  /** Category id (blogCat.<id> in i18n). */
  category: string;
  minutes: number;
  image: ImageMetadata;
  /** Only the featured one has a described image; the rest are decorative (alt=""). */
  describedImage?: boolean;
  date?: string;
  excerpt?: boolean;
};

export type Post = {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt?: string;
  minutes: number;
  image: ImageMetadata;
  alt: string;
  date?: string;
};

const featuredBase: PostBase = {
  slug: 'cuanta-comida-por-invitado',
  category: 'planificacion',
  minutes: 6,
  image: canapesTeteras,
  describedImage: true,
  date: '2026-09-18',
  excerpt: true,
};

const postsBase: PostBase[] = [
  { slug: 'alergias-invitados', category: 'alergenos', minutes: 5, image: tartaletas, excerpt: true },
  { slug: 'coctel-o-banquete', category: 'formatos', minutes: 4, image: bandejaEspejo, excerpt: true },
  { slug: 'mesa-dulce-comuniones', category: 'comuniones', minutes: 5, image: mesaDulce, excerpt: true },
  { slug: 'checklist-empresa', category: 'empresa', minutes: 7, image: canapesRemolacha, excerpt: true },
  { slug: 'fruta-temporada-verano', category: 'temporada', minutes: 4, image: brochetasFruta, excerpt: true },
  { slug: 'degustacion-boda', category: 'bodas', minutes: 6, image: servilletaLazo, excerpt: true },
];

/** The 3 posts of the Inicio block (design). */
const homeBase: PostBase[] = [
  { slug: 'confirmar-asistencia', category: 'invitados', minutes: 5, image: sobresAceitunas },
  { slug: 'cuanta-comida-por-invitado', category: 'planificacion', minutes: 6, image: canapesTeteras },
  { slug: 'coctel-o-banquete', category: 'formatos', minutes: 4, image: bandejaEspejo },
];

function localize(post: PostBase, t: T): Post {
  return {
    slug: post.slug,
    category: post.category,
    categoryLabel: t(`blogCat.${post.category}`),
    title: t(`post.${post.slug}.title`),
    excerpt: post.excerpt ? t(`post.${post.slug}.excerpt`) : undefined,
    minutes: post.minutes,
    image: post.image,
    alt: post.describedImage ? t(`post.${post.slug}.alt`) : '',
    date: post.date,
  };
}

export const getFeaturedPost = (t: T) => localize(featuredBase, t);
export const getPosts = (t: T) => postsBase.map((p) => localize(p, t));
export const getHomePosts = (t: T) => homeBase.map((p) => localize(p, t));
