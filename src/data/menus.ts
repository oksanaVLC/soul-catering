// Images of the booking menus. The data (name, description, DEMO price) comes from
// the catalog (booking-catalog.ts); here the photo of each menu is added only for the interface.
import type { ImageMetadata } from 'astro';
import type { Menu } from '../types/reservation.ts';
import { bookingCatalog } from './booking-catalog.ts';
import canapesRemolacha from '../assets/images/canapes-remolacha.webp';
import servilletaLazo from '../assets/images/servilleta-lazo.webp';
import bandejaEspejo from '../assets/images/bandeja-espejo.webp';

const images: Record<string, ImageMetadata> = {
  coctel: canapesRemolacha,
  banquete: servilletaLazo,
  mixto: bandejaEspejo,
};

export type MenuWithImage = Menu & { image: ImageMetadata };

export const menus: MenuWithImage[] = bookingCatalog.menus.map((menu) => ({
  ...menu,
  image: images[menu.id],
}));
