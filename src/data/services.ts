// Services of the Inicio gallery (design texts, in i18n).
// Only «Bodas» has an approved page; the rest are pending screens (href: null).
import type { ImageMetadata } from 'astro';
import noviosTarta from '../assets/images/novios-tarta.webp';
import bandejaEspejo from '../assets/images/bandeja-espejo.webp';
import canapesTeteras from '../assets/images/canapes-teteras.jpg';
import mesaDulce from '../assets/images/mesa-dulce.jpg';
import canapesRemolacha from '../assets/images/canapes-remolacha.webp';
import brownies from '../assets/images/brownies.webp';

import type { T } from '../i18n/utils';

export type Service = {
  id: string;
  title: string;
  text: string;
  image: ImageMetadata;
  alt: string;
  /** Path without language prefix, or null if the page does not exist yet. */
  href: string | null;
};

// Texts in i18n: svc.<id>.title / .text / .alt
const base: Pick<Service, 'id' | 'image' | 'href'>[] = [
  { id: 'bodas', image: noviosTarta, href: '/servicios/bodas' },
  { id: 'empresa', image: bandejaEspejo, href: null },
  { id: 'privadas', image: canapesTeteras, href: null },
  { id: 'comuniones', image: mesaDulce, href: null },
  { id: 'coctel', image: canapesRemolacha, href: null },
  { id: 'dulces', image: brownies, href: null },
];

export function getServices(t: T): Service[] {
  return base.map((s) => ({
    ...s,
    title: t(`svc.${s.id}.title`),
    text: t(`svc.${s.id}.text`),
    alt: t(`svc.${s.id}.alt`),
  }));
}
