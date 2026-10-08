# CLAUDE.md — Soul Catering (demo)

Instrucciones para Claude Code. **Léelas enteras antes de cualquier tarea.** Si algo no está aquí ni en `design/`, **pregunta antes de decidir**.

---

## 1. Alcance: una DEMO solo de frontend

Vamos a construir en código, con **Astro**, el diseño ya cerrado de la web de catering **Soul Catering** (Valencia). Es una **demo visual e interactiva**, no un producto en producción.

**Sí entra:**
- Todas las pantallas del diseño, maquetadas fielmente, responsive y accesibles.
- 4 idiomas: `es` (por defecto, sin prefijo), `en`, `fr`, `ru`.
- Interacciones de interfaz en el navegador con **datos simulados**: sliders, menú móvil, selector de idioma, pasos de la reserva, calendario, contador de invitados, total estimado, pestañas de login/registro, filtros y búsqueda del panel de invitados.
- Formularios con validación nativa del navegador. Al enviarlos se muestra un mensaje de éxito simulado.

**No entra (no instalar, no configurar, no simular con servicios reales):**
- Pagos (Stripe u otros), emails (Resend u otros), autenticación real (Supabase, Google OAuth), bases de datos, APIs, endpoints, SSR, adaptadores de servidor ni variables de entorno.
- Botones como «Pagar señal», «Entrar con Google» o «Crear cuenta» solo cambian el estado de la interfaz (pantalla de confirmación, mensaje). No llaman a ningún servicio.

El sitio se genera **100 % estático** (`output: 'static'`, que es el valor por defecto).

**Público:** mucha gente mayor. La legibilidad y la accesibilidad tienen prioridad sobre cualquier efecto visual.

---

## 2. Carpetas

Ruta local (Windows): `C:\Users\Oksana\MisWeb\Soul_Catering`

```text
Soul_Catering/
├─ CLAUDE.md
├─ design/            ← exportación del diseño (solo lectura, no se despliega)
│  ├─ html/           ← un .html por pantalla
│  └─ png/            ← una captura por pantalla
├─ assets/            ← fotos, texturas y vídeo originales (solo lectura)
└─ (proyecto Astro: package.json, astro.config.mjs, src/, public/)
```

- `design/` es la **única fuente de verdad visual**. Antes de construir una pantalla, abre su PNG y su HTML.
- En los HTML exportados las imágenes apuntan a `/_blob/...` y no cargan en local. Usa el **PNG para ver el aspecto** y el **HTML para copiar estructura, textos, colores, tamaños y espaciados**. El HTML exportado no es código de producción.
- No modifiques `design/` ni `assets/`. Copia los archivos que hagan falta de `assets/` a `src/assets/images/` (fotos y texturas) o a `public/video/` (vídeo).

---

## 3. Pantallas y rutas

| Pantalla en `design/` | Ruta | Notas |
|---|---|---|
| Inicio — versión 4 | `/` | La única versión de Inicio válida |
| Servicios extra | `/extras` | Filtros por categoría y «Añadir a mi reserva» (solo interfaz) |
| Servicio: Bodas | `/servicios/bodas` | Plantilla para el resto: `/servicios/[slug]` |
| Blog | `/blog` | Plantilla de artículo `/blog/[slug]` con el mismo estilo |
| Reserva con calendario | `/reserva` | 6 pasos (ver §5) |
| Acceso gestores | `/acceso` | Pestañas Entrar / Crear cuenta |
| Panel admin: invitados | `/panel/invitados` | Datos de ejemplo |

Otros idiomas con prefijo: `/en/...`, `/fr/...`, `/ru/...`.

---

## 4. Secciones de Inicio (en este orden)

1. **Hero** con vídeo a pantalla completa. Sobre él, la cabecera.
2. **Nuestros servicios**: slider de 6 tarjetas.
3. **Nosotros**: foto a todo el ancho y debajo el texto.
4. **Reserva online — «Seis pasos, sin llamadas»**: foto a un lado, lista de pasos y nota «Pago seguro».
5. **Servicios extra**: slider y botón «Ver todos los extras» → `/extras`.
6. **La plataforma**: slider de 7 tarjetas. Las «imágenes» son **mini-pantallas hechas en HTML/CSS**, no fotos.
7. **Blog**: 3 artículos.
8. **Testimonios**: carrusel de una cita.
9. **Preguntas frecuentes**: acordeón con `<details>`.
10. **Contacto**: datos y formulario.
11. **Pie** con newsletter.

---

## 5. Reserva: 6 pasos (definición única)

En toda la web los pasos son **estos seis y en este orden**:

1. **Menú**
2. **Invitados**
3. **Fecha**
4. **Lugar**
5. **Servicios extra**
6. **Tus datos y pago de la señal**

- La banda de Inicio («Seis pasos, sin llamadas») y la página `/reserva` muestran exactamente esta lista.
- La sección «Paso a paso» de la página de Bodas **no** es el flujo de reserva: es el proceso de una boda (reserva → señal → degustación → invitados). Se mantiene tal cual está en el diseño.
- La fecha queda «bloqueada» al pagar la señal. En la demo esto es solo un texto informativo y una pantalla de confirmación simulada.
- La señal se muestra como un **porcentaje configurable** (constante en `src/data/config.ts`, valor de demo 30). No escribas `30` repartido por el código.
- Calendario: días disponibles, «pocas plazas», completos (no seleccionables) y seleccionado. **Nunca diferenciados solo por color**: usa también tachado, punto o texto, y `aria-label` por día.
- Precios de menús y extras: **valores de ejemplo** definidos en `src/data/`, con el aviso visible «Precios de ejemplo».

---

## 6. Sistema de diseño

> Actualizado con **CAMBIOS-v5** (octubre 2026). Si algo de `design/` choca con esta sección, manda esta sección.

### Colores (`src/styles/tokens.css`)
Base (se siguen usando):
```css
--bg: #F6F2E9;          /* fondo general de las páginas */
--surface: #FFFDF8;     /* tarjetas */
--white: #FFFFFF;
--ink: #141414;         /* pie y botones del estilo anterior */
--text: #2B2B28;  --text-2: #3A3934;  --muted: #55554F;
--gold: #6E5A1E;  --accent: #B8963E;  --straw: #E9DCB8;  --line: #DAD6CC;
--silver-base: #EDEDEC;
/* estados */
--ok-bg: #E3EBDD;    --ok: #2F4A26;
--wait-bg: #F6EAD3;  --wait: #6E4B12;
--allergen-bg: #F3EADB; --allergen: #5B4422;
```
v5 (autorizados):
```css
--brown: #3B2810;        /* botón principal v5 */
--brown-hover: #1E1A16;
--bronze: #7A5A22;       /* eyebrows, números, cursivas de títulos — 6:1 sobre blanco */
--gold-line: #C9A96E;    /* SOLO líneas decorativas, nunca texto sobre fondo claro */
--ink-v5: #1E1A16;       /* titulares, menú */
--text-v5: #4A4033;      /* párrafos — 9,6:1 sobre blanco */
--ivory: #F4F0EA;  --cream: #FAF7F2;   /* fondos neutros */
--hairline: rgba(138,104,48,.22);
--hero-ink: #2A1C10;  --hero-accent: #5E4418;  --hero-eyebrow: #5A4216;
--ease: cubic-bezier(.22,1,.36,1);
```
No añadas colores nuevos sin preguntar.

### Fondos
- **Sin textura de papel** (eliminada). Colores lisos con las clases `.bg-ivory`, `.bg-cream`, `.bg-white` y `.bg-base` (`--bg`): Nuestros servicios `--ivory` · Nosotros `--cream` · Servicios extra `#FFF` · Blog `#FFF` · FAQ `--cream` · mitad del formulario de Acceso `--cream` · Menús `--cream` · resto de páginas `--bg`.
- **Textura gris de luces y sombras** (clase `.silver`): imagen al **55 %** sobre `--silver-base`, con `::before` y `z-index:-1`, en Reserva online (pasos), La plataforma, Testimonios y Contacto. No se sustituye por color liso.
- **Cabeceras de páginas internas** (`PageHero`): foto a todo el ancho con un degradado inferior que se funde con el color de la **sección siguiente** (prop `fadeTo`).

### Tipografía
- Títulos: **Cormorant Garamond** 300/400/500/600 y cursivas 300/400 (`--font-serif`). Texto: **Lato** 400/700 (`--font-sans`; el 300 no se usa). Logo: **Casko Luxury** 400 (`--font-logo`: `'Casko Luxury', 'Cormorant Garamond', Georgia, serif`), solo para el logo; archivos en `public/fonts/` (woff2 + woff, sin el .ttf), `@font-face` en `global.css` y precargada (woff2) en `BaseLayout`. No uses otras fuentes. Lato no tiene cirílico: detrás va **Carlito** (basada en Lato, solo subconjunto cirílico), así que la pila es `'Lato', 'Carlito', system-ui, sans-serif`.
- `body`: Lato 400, 19px, `line-height:1.75`, color `--text-v5`. Lead: 21px, `line-height:1.8`.
- H1: Cormorant 300, `clamp(56px, 7.4vw, 108px)`, `line-height:1.02`. H2: Cormorant 300, `clamp(44px, 5vw, 68px)`, `line-height:1.1`. H3: Cormorant 500, 28–34px, `line-height:1.15`. Color de los titulares: `--ink-v5`.
- `h1 em, h2 em`: cursiva 400 en `--bronze`. Los H2 de sección van en dos líneas: en i18n se separan con `|` y se pintan con `TwoLineTitle` (la segunda línea va en `<em>`).
- Eyebrow: Lato 700, 14px, mayúsculas, `letter-spacing:.3em`, color `--bronze`, con una línea de 44×1px en `--gold-line` delante.
- **Tamaño mínimo: 15px.** Únicas excepciones: etiquetas en mayúsculas con espaciado (eyebrow 14px, texto de botón v5 13–14px, «DESCUBRE» 11px). El texto corrido nunca baja de 17px.

### Layout
- Contenedor `max-width:1240px`; padding lateral 40px (20px en móvil).
- Debe verse bien de 390px a 1920px, sin scroll horizontal (`main` lleva `overflow-x:clip`).
- Cabecera fija de 96px (`--header-h`): el contenido de las páginas internas empieza debajo (`main.under-header`) y todos los `[id]` llevan `scroll-margin-top: var(--header-h)`. Los elementos `sticky` se colocan por debajo de la cabecera.

### Componentes
- **Botones v5** (`Button` con `variant="v5-dark"` o `"v5-light"`): radio 2px, alto 58px, padding 0 38px, Lato 700 14px, mayúsculas, `letter-spacing:.22em`, borde 1px. Relleno que se desliza en hover (`::before` con `scaleX(0→1)`, `.55s var(--ease)`). `v5-dark`: fondo `--brown`, relleno `--brown-hover`. `v5-light`: fondo **blanco** (nunca transparente), texto `--brown`, borde `rgba(59,40,16,.45)`, relleno `--brown` y texto blanco. Tamaño pequeño (`size="sm"`): 46px, padding 0 24px, 13px. Foco: `outline` de 2px en `--gold-line`, offset 4px. Se usan en el hero, la cabecera y el menú móvil.
- **Botones del estilo anterior** (`dark`, `light`, `straw`: píldora negra o blanca, 56px, 17–18px, nunca fondo transparente): siguen en el resto de secciones hasta que se decida cambiarlos.
- **Logo**: «Soul Catering» en una sola línea, Casko Luxury (`--font-logo`) 400, 29px, `letter-spacing:.02em`, `line-height:1.05`, `white-space:nowrap`, color `--bronze`; `aria-label` «Soul Catering, inicio» cuando es enlace. Componente `Logo`, igual en la cabecera, Acceso, el panel y el pie (en el pie, `tone="light"`, color `--foot-logo` #E6D3A8). En la cabecera de móvil (≤480px) baja a `clamp(22px, 6.2vw, 29px)` para que quepan el idioma y la hamburguesa.
- **Cabecera** (igual en todas las páginas públicas): `fixed`, 96px, fondo `rgba(255,255,255,.82)` con `backdrop-filter: blur(10px)` y sombra `0 1px 0 rgba(138,104,48,.12)`. Tras 40px de scroll se añade `.is-solid` (fondo al 97 %). Contiene:
  - el logo;
  - el menú Servicios · Nosotros · Extras · Blog · Contacto (Lato 15px, mayúsculas, `letter-spacing:.2em`, `--ink-v5`, separación de 30px, 22px por debajo de 1400px, con una línea en `--gold-line` que crece en hover);
  - el selector de idioma (globo + código + flecha, sin borde ni fondo; desplegable blanco con borde `--hairline` y radio 2px);
  - los botones **Reserva** y **Login** (`v5-dark` pequeños).

  Todo en una sola línea (la barra de la cabecera usa `max-width:1380px`, más ancha que el contenedor). Por debajo de 1260px pasa a menú hamburguesa (es el ancho mínimo en que cabe en francés, el idioma más largo): `<button>` real con `aria-expanded` y `aria-controls`, se cierra con Esc y devuelve el foco al botón.
- **Tarjeta de servicio**: radio 20px, imagen cuadrada arriba, cuerpo blanco con título, texto y enlace de texto «Descubrir →» (no botón).
- **Sliders** (`Slider`): CSS `scroll-snap`, sin librerías. En pantallas grandes, rejilla con todas las tarjetas; en pantallas pequeñas, carrusel (en Plataforma, hasta 1280px). La cabecera de la sección va en el slot `head`. A su derecha, alineadas abajo con el título (debajo en móvil), van dos flechas cuadradas `.sq-arrow`: 58×58, radio 2px, borde `rgba(59,40,16,.45)`, fondo blanco, flecha fina de 22px; en hover, fondo `--brown` y flecha blanca; separación de 12px. Solo se muestran en modo carrusel. Los puntos indicadores van debajo de las tarjetas.
- **Testimonios**: las mismas flechas, a ambos lados de los indicadores. Los indicadores son rayas de 2px (16px la inactiva, 36px la activa en `--gold-line`) con un área táctil de 44px.
- **FAQ**: `<details>`. El «+» es una cruz de líneas finas en `--bronze` que gira 45° al abrir.
- Áreas táctiles de 44px como mínimo; contraste de 4.5:1 como mínimo; ningún texto en `--gold-line` sobre fondo claro.

### Hero de Inicio
- Sección `height:100svh; min-height:640px` (`max-height:940px` desde 1024px). Contenido centrado en vertical y en horizontal, de arriba abajo:
  1. eyebrow con una línea dorada a cada lado;
  2. H1 en dos líneas («Una experiencia» / «culinaria única», esta en cursiva `--hero-accent`), color `--hero-ink` con `text-shadow` blanco;
  3. párrafo de 21px (máximo 640px);
  4. botones «Consultar disponibilidad» (`v5-dark`) y «Ver servicios» (`v5-light`);
  5. indicador decorativo «DESCUBRE» abajo del todo.

  En móvil, H1 `clamp(44px, 12vw, 64px)` y los botones uno debajo del otro a ancho completo.
- Velo que no oscurece: halo radial blanco detrás del texto y degradado de blanco a turquesa al 16 %.
- Vídeo en `public/video/`, más `hero-poster.jpg`. Ambos vídeos en `yuv420p`, 30 fps, sin audio y con `faststart`:
  - `hero.mp4`: 1080p, H.264 High 4.0;
  - `hero-720.mp4`: 720p, Main 3.1, para pantallas de hasta 900px.
- Atributos obligatorios para iOS: `autoplay muted loop playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback poster aria-hidden tabindex="-1"`. Un script en `astro:page-load` fuerza `muted` y llama a `play()`. Si falla, añade `.no-video` y se ve el póster como fondo fijo, nunca el botón de play nativo.

### Animaciones
- **Al hacer scroll**: `data-reveal="up|left|right"` y `data-reveal-delay="1|2|3"` (0,12, 0,24 y 0,36 s). Solo ocultan contenido cuando existe la clase `html.js`. `src/scripts/reveal.ts` (IntersectionObserver, `rootMargin '0px 0px -80px 0px'`, `threshold .08`) añade `.is-in`. Dónde se aplica:
  - cabeceras de sección: `left`;
  - flechas o columna derecha: `right` con delay 1;
  - tarjetas de rejilla y del blog: `up`, con delay por columna;
  - sliders: el contenedor entero con `up`;
  - nada dentro del hero.

  Si un elemento con `data-reveal` tiene `transform` en hover, defínelo con `[data-reveal].is-in:hover`.
- **Hero al cargar**:
  - vídeo con fundido y escala de 1.04 a 1 (1,6 s);
  - el eyebrow baja 14px;
  - H1 letra a letra: spans `aria-hidden` y `aria-label` en el `<h1>`, 0,045 s por letra a partir de 0,35 s;
  - el párrafo y los botones suben 18px (a 1,15 s y 1,35 s);
  - el indicador de scroll aparece a 1,9 s, con la línea «goteando» en bucle.
- **Microinteracciones**: las imágenes de tarjetas y del blog hacen `scale(1.05)` en hover (1,1 s `var(--ease)`, dentro de `overflow:hidden`); los enlaces de texto llevan una línea en `--gold-line` que crece de 28px al 100 %.
- Todo se desactiva con `prefers-reduced-motion: reduce`.

---

## 7. Imágenes (regla obligatoria)

- Fotos y texturas siempre en `src/assets/images/` y con `<Image />` o `<Picture />` de `astro:assets`, con `alt` y `sizes` correctos.
- No pongas fotos de contenido en `public/` ni uses `<img src="/...">` para ellas. `public/` es solo para favicon y vídeo.
- `loading="lazy"` en todo lo que esté bajo el primer pantallazo. El póster del hero no se carga en diferido.
- Los nombres de archivo de `assets/` pueden no coincidir con lo que muestra el diseño. Identifica cada imagen mirándola y compárala con el PNG de la pantalla.

---

## 8. Stack y dependencias

Basado en mi otro proyecto, pero **solo con lo que necesita esta demo**:

```json
{
  "name": "soul-catering",
  "type": "module",
  "version": "0.0.1",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^7.3.2",
    "@astrojs/mdx": "^8.0.2",
    "@astrojs/sitemap": "^3.7.4",
    "@fontsource/carlito": "^5.3.0",
    "@fontsource/cormorant-garamond": "^5.3.0",
    "@fontsource/lato": "^5.3.0",
    "@fortawesome/fontawesome-svg-core": "^7.3.1",
    "@fortawesome/free-solid-svg-icons": "^7.3.1",
    "@fortawesome/free-brands-svg-icons": "^7.3.1",
    "sharp": "^0.35.4"
  },
  "devDependencies": {
    "prettier": "^3.9.8",
    "prettier-plugin-astro": "^1.0.1"
  }
}
```

Fuentes (ver §6): Cormorant Garamond (títulos), Lato (texto), Casko Luxury (solo el logo, archivos propios en `public/fonts/`) y Carlito (solo el subconjunto cirílico, como respaldo de Lato en ruso; se declara con `@font-face` y `unicode-range` en `global.css`).

**No incluir**: `@astrojs/markdown-satteri`, `@fontsource/plus-jakarta-sans`, `@fontsource/rubik-dirt`, `@fontsource-variable/fraunces`, `@fontsource-variable/caveat`, `simple-icons`, `@fortawesome/free-regular-svg-icons` (salvo que haga falta un icono concreto), ni ningún adaptador, SDK de pagos, auth o email.
Antes de instalar **cualquier** otro paquete, pregunta.

`astro.config.mjs`:
- integraciones `mdx()` y `sitemap()`;
- i18n: `defaultLocale: 'es'`, `locales: ['es','en','fr','ru']`, `routing: { prefixDefaultLocale: false }`;
- `site`: un valor provisional, por ejemplo `https://soul-catering.example`.

Transiciones entre páginas: `ClientRouter` de `astro:transitions` en el layout base, con fundido corto (250–400 ms). Todo el JavaScript tiene que seguir funcionando tras navegar: inicialízalo en `astro:page-load`.

Animaciones: entradas suaves al hacer scroll (`opacity` y `transform`) con `IntersectionObserver`, sin librerías. Con `prefers-reduced-motion: reduce` se desactivan.

---

## 9. Estructura del proyecto

```text
src/
├─ assets/images/
├─ components/
│  ├─ layout/   Header, LangSwitcher, MobileMenu, Footer
│  ├─ ui/       Button, Slider, ServiceCard, PageHero, Eyebrow
│  ├─ home/     Hero, Services, About, BookingSteps, Extras, Platform, BlogTeaser, Testimonials, Faq, Contact
│  ├─ booking/  BookingForm, Calendar, GuestCounter, Summary
│  └─ panel/    Sidebar, GuestTable, StatusBadge
├─ content/     blog/, services/   (Content Collections, con campo `lang`)
├─ data/        config.ts (porcentaje de señal), menus.ts, extras.ts, guests.ts, availability.ts — todo de ejemplo
├─ i18n/        es.json, en.json, fr.json, ru.json, utils.ts
├─ layouts/     BaseLayout.astro, PanelLayout.astro
├─ pages/       index, extras, servicios/[slug], blog/index, blog/[slug], reserva, acceso, panel/invitados (+ en/, fr/, ru/)
└─ styles/      tokens.css, global.css
public/
├─ favicon.svg
└─ video/       hero.mp4, hero-poster.jpg
```

`BaseLayout`: `<html lang>`, SEO básico (title, description, canonical, Open Graph, `hreflang` de los 4 idiomas), enlace «Saltar al contenido», Header, `<main id="main-content">`, Footer y `ClientRouter`.

No crees componentes ni abstracciones que no se usen.

---

## 10. Textos e idiomas

- Los textos en español son los del diseño. Cópialos tal cual.
- Los textos de interfaz van en `src/i18n/*.json`, sin escribirlos a mano dentro de los componentes.
- Traducciones en/fr/ru: genera un primer borrador marcado con `// TODO revisar` en el JSON. No las presentes como definitivas.
- Datos que no existen: usa marcadores como `[TELÉFONO]`, `[EMAIL]`, `[DIRECCIÓN]`, `[PRECIO]`, `[ZONA DE SERVICIO]`, igual que en el diseño.
- Testimonios, textos de «Nosotros» y datos del panel son **de demo**. Márcalos con `<!-- DEMO -->` y conserva los avisos visibles del diseño («Opiniones de ejemplo para la demo», «Texto de ejemplo para la demo», «datos de ejemplo»).

---

## 11. Accesibilidad (obligatorio)

- HTML semántico; `<button>` y `<a>` reales; nada de `div` clicables.
- Todos los campos con `<label>` y `autocomplete` cuando corresponda, y mensajes de error claros.
- Foco siempre visible. Nunca `outline:none` sin alternativa.
- Contraste mínimo de 4.5:1, ningún texto menor de 15px, áreas táctiles de 44px.
- Estados (confirmado, pendiente, completo...) nunca indicados solo por color.
- Objetivo Lighthouse: Accesibilidad ≥ 95 y Rendimiento, Buenas prácticas y SEO en verde.

---

## 12. Orden de trabajo

0. **Auditoría (sin instalar nada)**: revisa la carpeta, Node/npm, `design/png`, `design/html` y `assets/`. Entrégame un informe breve con lo que encuentres y las dudas. Espera mi OK.
1. **Base**: proyecto Astro, `package.json` de §8, tokens, fuentes, BaseLayout, Header (idiomas y menú móvil), Footer.
2. **Inicio** completo, sección a sección, comparando con `design/png` de Inicio v4.
3. **Servicio (Bodas)**, **Servicios extra** y **Blog** (listado y artículo).
4. **Reserva** (6 pasos, calendario, total y confirmación simulada).
5. **Acceso** y **Panel de invitados** (filtros y búsqueda con datos de ejemplo).
6. **Idiomas** en/fr/ru y rutas.
7. **Pulido**: animaciones, revisión en 390 / 768 / 1024 / 1440 / 1920 px, Lighthouse.

Después de cada fase:
- `npm run build` sin errores ni avisos nuevos;
- resumen de lo hecho, archivos tocados, decisiones tomadas y dudas;
- **nunca afirmes que algo funciona sin haberlo comprobado**.

---

## 13. Reglas generales

- **Fidelidad**: respeta colores, tamaños, espaciados, imágenes y textos del diseño. Si algo no se puede hacer igual, explica por qué, propone una alternativa y espera mi OK.
- **Sin backend**: si una tarea parece requerir servidor, pagos, emails o login real, para y pregunta.
- **Rendimiento**: el mínimo JavaScript (solo para sliders, menú móvil, idiomas, reserva, acceso y panel), imágenes optimizadas, sin librerías innecesarias.
- **Windows**: comandos compatibles con PowerShell.
- **Git**: commits pequeños en español (`feat: añade cabecera`, `fix: corrige menú móvil`...).
