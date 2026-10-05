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

### Colores (`src/styles/tokens.css`)
```css
--bg: #F6F2E9;          /* fondo general */
--bg-header: #FBF8F2;   /* cabecera */
--surface: #FFFDF8;     /* tarjetas */
--white: #FFFFFF;
--ink: #141414;         /* títulos, botones, pie */
--text: #2B2B28;
--text-2: #3A3934;
--muted: #55554F;       /* mínimo para texto */
--gold: #6E5A1E;        /* etiquetas (eyebrow) */
--accent: #B8963E;      /* detalles, foco */
--straw: #E9DCB8;
--line: #DAD6CC;
--silver-base: #EDEDEC;
--hero-text: #3A2418;
/* estados */
--ok-bg: #E3EBDD;    --ok: #2F4A26;
--wait-bg: #F6EAD3;  --wait: #6E4B12;
--allergen-bg: #F3EADB; --allergen: #5B4422;
```
No añadas colores nuevos sin preguntar.

### Texturas (en `src/assets/images/`)
- **Papel beige**: cabecera, Nuestros servicios, Nosotros, Servicios extra, Blog, FAQ y la mitad del formulario de Acceso. Opacidad 100 %.
- **Gris de luces y sombras**: Reserva online (pasos), La plataforma, Testimonios y Contacto. Imagen al **55 %** sobre `--silver-base`.
- Se aplican con `::before` absoluto y `z-index:-1`, siempre por debajo del texto.

### Tipografía
- Títulos: **Cormorant Garamond 600**. Texto: **Plus Jakarta Sans 400/500/600/700**. No uses otras fuentes.
- Texto base 19px, interlineado 1.65; lead 21px; **nunca menos de 15px**.
- H1 `clamp(50px, 6vw, 88px)`; H2 `clamp(40px, 4.6vw, 62px)`; eyebrow 15px en mayúsculas, `letter-spacing:.16em`, color `--gold`.

### Layout
- Contenedor `max-width:1240px`; padding lateral 40px (20px en móvil).
- Debe verse bien de 390px a 1920px, sin scroll horizontal.

### Componentes
- **Botones**: píldora (`border-radius:999px`), alto mínimo 56px (50px en cabecera), texto 17–18px. Principal negro `--ink` con texto blanco. Secundario blanco con borde negro. **Nunca fondo transparente.** Estados hover, foco visible y disabled.
- **Cabecera** (igual en todas las páginas públicas), con fondo papel beige:
  - logo «Soul Catering»;
  - menú: Servicios · Nosotros · Extras · Blog · Contacto;
  - selector de idioma: icono **globo** de Font Awesome, desplegable, sin borde ni fondo;
  - botones negros **Reserva** y **Login**.

  Todo en una sola línea. Por debajo de 1180px pasa a menú hamburguesa: `<button>` real con `aria-expanded` y `aria-controls`, se cierra con Esc y devuelve el foco al botón.
- **Tarjeta de servicio**: radio 20px, imagen cuadrada arriba, cuerpo blanco con título, texto y enlace de texto «Descubrir →» (no botón).
- **Sliders**: CSS `scroll-snap` horizontal, deslizables con el dedo, **flechas gruesas a los lados** (`<button>` con `aria-label`). A partir de 1400px van en el margen, sin fondo; en pantallas más pequeñas van sobre la imagen, dentro de un círculo claro. Nada de librerías de sliders.
- **Cabeceras de páginas internas**: foto a todo el ancho que se funde abajo con `--bg` mediante un degradado.
- Áreas táctiles de 44px como mínimo; contraste de 4.5:1 como mínimo.

### Hero de Inicio
- Vídeo en `public/video/`: `<video autoplay muted loop playsinline preload="metadata" poster="...">`, `width:100%`, `height:100svh`, `object-fit:cover`. Tiene que funcionar en iPhone, Android y escritorio.
- Capa blanca al 22 % encima (no oscurecer). Texto en `--hero-text`. Titular: «Una experiencia culinaria única».
- No sirvas el vídeo original en 4K. Crea una versión 1080p H.264 con `ffmpeg -i original.mp4 -vf scale=1920:-2 -c:v libx264 -crf 26 -movflags +faststart -an hero.mp4` y un `hero-poster.jpg`. Si `ffmpeg` no está instalado, avísame.

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
    "@fontsource/plus-jakarta-sans": "^5.3.0",
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

Añade la fuente de los títulos con `npm install @fontsource/cormorant-garamond`.

**No incluir**: `@astrojs/markdown-satteri`, `@fontsource-variable/fraunces`, `@fontsource-variable/caveat`, `simple-icons`, `@fortawesome/free-regular-svg-icons` (salvo que haga falta un icono concreto), ni ningún adaptador, SDK de pagos, auth o email.
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
