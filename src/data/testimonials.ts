// DEMO: example testimonials (design: «Opiniones de ejemplo para la demo»).
export type Testimonial = { text: string; name: string; meta: string };

export const testimonials: Testimonial[] = [
  { text: '“Nuestros invitados todavía hablan del cóctel. Y poder ver en un solo sitio el menú, las alergias y los pagos nos quitó muchísimo estrés.”', name: 'Laura y Daniel', meta: 'Boda · Finca en Godella · 140 invitados' },
  { text: '“Organizamos la cena anual de la empresa en dos semanas. Todo puntual, bien presentado y sin una sola llamada de seguimiento.”', name: 'Marta Gil', meta: 'Evento de empresa · Valencia · 80 invitados' },
  { text: '“Mi madre tiene 82 años y pudo revisar el menú ella sola desde la tablet. Letra grande, todo claro.”', name: 'Familia Ortega', meta: 'Comunión · Paterna · 45 invitados' },
  { text: '“Varios invitados tenían alergias distintas y cada plato llegó adaptado a su persona. Un detalle que se nota.”', name: 'Irina S.', meta: 'Aniversario · Valencia · 30 invitados' },
];
