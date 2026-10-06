// DEMO: example testimonials (design: «Opiniones de ejemplo para la demo»). Texts in i18n (testi.<n>.*).
import type { T } from '../i18n/utils';

export type Testimonial = { text: string; name: string; meta: string };

const COUNT = 4;

export function getTestimonials(t: T): Testimonial[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    text: t(`testi.${i + 1}.text`),
    name: t(`testi.${i + 1}.name`),
    meta: t(`testi.${i + 1}.meta`),
  }));
}
