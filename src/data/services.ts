// Services of the Inicio slider (design texts).
// Only «Bodas» has an approved page; the rest are pending screens (href: null).
import type { ImageMetadata } from 'astro';
import noviosTarta from '../assets/images/novios-tarta.webp';
import bandejaEspejo from '../assets/images/bandeja-espejo.webp';
import canapesTeteras from '../assets/images/canapes-teteras.jpg';
import mesaDulce from '../assets/images/mesa-dulce.jpg';
import canapesRemolacha from '../assets/images/canapes-remolacha.webp';
import brownies from '../assets/images/brownies.webp';

export type Service = {
  title: string;
  text: string;
  image: ImageMetadata;
  alt: string;
  /** Path without language prefix, or null if the page does not exist yet. */
  href: string | null;
};

export const services: Service[] = [
  { title: 'Bodas', text: 'Del cóctel de bienvenida a la recena, con degustación previa.', image: noviosTarta, alt: 'Novios sirviendo la tarta junto a una mesa de postres', href: '/servicios/bodas' },
  { title: 'Eventos de empresa', text: 'Cócteles, coffee breaks, presentaciones y cenas de gala.', image: bandejaEspejo, alt: 'Bandeja de espejo con aperitivos', href: null },
  { title: 'Celebraciones privadas', text: 'Cumpleaños, aniversarios y comidas familiares, en casa o en finca.', image: canapesTeteras, alt: 'Bandeja de canapés junto a teteras', href: null },
  { title: 'Comuniones y bautizos', text: 'Menús pensados para mayores y pequeños, con mesa dulce.', image: mesaDulce, alt: 'Porciones de tarta sobre blondas', href: null },
  { title: 'Cóctel y finger food', text: 'Bocados servidos o en estaciones, para cualquier formato.', image: canapesRemolacha, alt: 'Canapés de centeno con remolacha', href: null },
  { title: 'Mesas dulces', text: 'Postres en formato mini para cerrar la celebración.', image: brownies, alt: 'Brownies de chocolate con menta', href: null },
];
