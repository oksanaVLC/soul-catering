# Soul Catering — Cambios v5 (instrucciones para Claude Code)

Este archivo describe **seis cambios concretos** sobre la web ya construida en Astro.
Léelo junto con `CLAUDE.md`. **Donde este archivo y `CLAUDE.md` no coincidan, manda este archivo.**

## Reglas de alcance

- Haz **solo** los seis cambios de abajo. No toques contenidos, textos, rutas, i18n, datos, la reserva, el panel ni la estructura de páginas.
- No cambies las tarjetas de servicio, el footer ni los formularios, salvo lo que diga expresamente el punto 3 (tipografía) o el punto 5 (fondos).
- Botones fuera del hero y de la cabecera: **se quedan como están** (no los cambies en esta tarea).
- Sin librerías nuevas de animación ni de sliders. Solo CSS y un script pequeño propio.
- Trabaja en este orden: 3 → 2 → 4 → 5 → 6 → 1. Tras cada punto, ejecuta `npm run build` y corrige los errores antes de seguir.
- Al terminar, **actualiza `CLAUDE.md` §6** (Sistema de diseño) para que refleje estos cambios y no queden reglas contradictorias.

---

## 3. Sistema tipográfico y tokens (`src/styles/tokens.css` y `src/styles/global.css`)

### Fuentes
```bash
npm install @fontsource/lato
npm uninstall @fontsource/plus-jakarta-sans
```
`@fontsource/cormorant-garamond` ya está instalada. Importa en `BaseLayout` (o en `global.css`) solo estos pesos:

- Cormorant Garamond: 300, 400, 500, 600 y las cursivas 300 y 400.
- Lato: 400 y 700 (300 no se usa: es demasiado fino para personas mayores).

Elimina cualquier referencia a Plus Jakarta Sans en todo el proyecto (`grep -r "Jakarta" src`).

### Tokens nuevos (añádelos a `tokens.css`, sin borrar los existentes)
```css
/* Tipografía */
--font-serif: 'Cormorant Garamond', Georgia, serif;
--font-sans: 'Lato', system-ui, sans-serif;

/* Colores v5 (autorizados) */
--brown: #3B2810;        /* botón principal */
--brown-hover: #1E1A16;
--bronze: #7A5A22;       /* eyebrows, números, cursivas de títulos — 6:1 sobre blanco */
--gold-line: #C9A96E;    /* SOLO líneas decorativas, nunca texto sobre fondo claro */
--ink-v5: #1E1A16;       /* titulares */
--text-v5: #4A4033;      /* párrafos — 9,6:1 sobre blanco */
--ivory: #F4F0EA;        /* fondo neutro 1 */
--cream: #FAF7F2;        /* fondo neutro 2 */
--hairline: rgba(138,104,48,.22);
--hero-ink: #2A1C10;
--hero-accent: #5E4418;
--hero-eyebrow: #5A4216;
--ease: cubic-bezier(.22,1,.36,1);
```

### Escala tipográfica (`global.css`)
| Elemento | Fuente | Peso | Tamaño | Otros |
|---|---|---|---|---|
| `body` | `--font-sans` | 400 | 19px | `line-height:1.75`, color `--text-v5` |
| Lead | `--font-sans` | 400 | 20–21px | `line-height:1.8` |
| H1 | `--font-serif` | 300 | `clamp(56px, 7.4vw, 108px)` | `line-height:1.02` |
| H2 | `--font-serif` | 300 | `clamp(44px, 5vw, 68px)` | `line-height:1.1` |
| H3 | `--font-serif` | 500 | 28–34px | `line-height:1.15` |
| `h1 em, h2 em` | `--font-serif` | 300/400 | — | `font-style:italic; color: var(--bronze)` |
| Eyebrow | `--font-sans` | 700 | 14px | mayúsculas, `letter-spacing:.3em`, color `--bronze`, con una línea de 44×1px en `--gold-line` delante (`::before`) |

- Los H2 de sección se escriben en dos líneas: la segunda dentro de `<em>` (p. ej. «Un catering a medida<br><em>para cada celebración</em>»). Los textos ya están en i18n: divide la cadena en dos claves o usa un separador, sin cambiar las palabras.
- Excepción a «nunca menos de 15px»: **solo** las etiquetas en mayúsculas con espaciado (eyebrow 14px, texto de botón 13–14px). Todo el texto corrido sigue en 17px o más.

---

## 2. Cabecera (navbar) — exactamente así

Sustituye el fondo de papel por esto. Es la misma cabecera en todas las páginas públicas.

- `position: fixed; top: 0; inset-inline: 0; z-index: 50; height: 96px`.
- Fondo `rgba(255,255,255,.82)` con `backdrop-filter: blur(10px)` (y `-webkit-backdrop-filter`), sombra `0 1px 0 rgba(138,104,48,.12)`.
- Al hacer scroll más de 40px se añade la clase `.is-solid`: fondo `rgba(255,255,255,.97)`. Transición `.5s var(--ease)`. Escucha el scroll con `{ passive: true }`.
- **Logo** apilado, alineado a la izquierda:
  - «SOUL»: `--font-serif` 300, 32px, `letter-spacing:.16em`, color `--bronze`.
  - «CATERING»: `--font-sans` 400, 11px, `letter-spacing:.42em`, color `--text-v5`, 4px por debajo.
  - Es un enlace a la home con `aria-label="Soul Catering, inicio"`.
- **Menú**: Servicios · Nosotros · Extras · Blog · Contacto. `--font-sans` 400, 15px, mayúsculas, `letter-spacing:.2em`, color `--ink-v5`, separación 34px. En hover crece una línea de 1px en `--gold-line` debajo (`transform: scaleX(0→1)`, `.4s var(--ease)`).
- **Idioma**: icono globo + «ES» + flecha, sin borde ni fondo, mismo color que el menú. El desplegable: fondo blanco, borde `--hairline`, radio 2px, sombra suave.
- **Botones Reserva y Login**: los dos iguales, estilo `btn-dark` del punto 4 en tamaño pequeño (`min-height:46px; padding:0 24px; font-size:13px`).
- Todo en una línea. Por debajo de 1180px, menú hamburguesa (icono de líneas en `--ink-v5`, mismo comportamiento accesible que ya tiene).
- Como la cabecera ahora es `fixed`, la primera sección de las páginas internas necesita `padding-top` o `scroll-margin-top` de 96px para que nada quede tapado. Los anclajes (`#servicios`, `#contacto`) también: `scroll-margin-top: 96px`.

---

## 4. Hero de Inicio: distribución, botones y vídeo en iPhone

### Distribución (todo centrado)
- Sección: `height: 100svh; min-height: 640px` (y `max-height: 940px` a partir de 1024px de ancho). Contenido centrado en vertical y horizontal, `text-align:center`, `padding-top: 72px` para compensar la cabecera.
- De arriba abajo:
  1. Eyebrow «Catering para eventos · Valencia», 15px, color `--hero-eyebrow`, con una línea dorada **a cada lado** (`::before` y `::after`).
  2. H1 en dos líneas, 34px por debajo del eyebrow: «Una experiencia» (Cormorant 300) / «culinaria única» (Cormorant 400 cursiva, color `--hero-accent`). Color `--hero-ink`, `text-shadow: 0 1px 18px rgba(255,255,255,.55)`.
  3. Párrafo, 30px por debajo: 21px, `max-width:640px`, color `--hero-ink`, `text-shadow: 0 1px 12px rgba(255,255,255,.7)`.
  4. Dos botones centrados, 42px por debajo, separados 16px: **«Consultar disponibilidad»** (`btn-dark`) y **«Ver servicios»** (`btn-light`).
  5. Indicador de scroll abajo del todo (30px del borde): línea vertical de 1×56px en `rgba(59,40,16,.55)` + «DESCUBRE» (11px, 700, `letter-spacing:.4em`, color `--brown`). Decorativo: `aria-hidden="true"`.
- En móvil el H1 baja a `clamp(44px, 12vw, 64px)` y los botones pasan uno debajo del otro a ancho completo.

### Capa sobre el vídeo (sin oscurecer)
Sustituye la capa blanca del 22 % por dos capas en un solo `div` (`aria-hidden`, `pointer-events:none`):
```css
background:
  radial-gradient(ellipse 58% 52% at 50% 54%, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 75%),
  linear-gradient(160deg, rgba(255,255,255,.16) 0%, rgba(178,226,232,.16) 100%);
```
Es un velo muy suave de blanco a turquesa y un halo blanco solo detrás del texto.

### Estilo nuevo de botón (componente `Button`, variantes nuevas)
Crea las variantes `dark` y `light` del nuevo estilo **sin romper** las variantes actuales (las usan otras secciones):
- Comunes: `border-radius:2px; min-height:58px; padding:0 38px; font: 700 14px/1 var(--font-sans); letter-spacing:.22em; text-transform:uppercase; border:1px solid`.
- Relleno que se desliza en hover: `::before` absoluto con `transform: scaleX(0)` y `transform-origin:left`, que pasa a `scaleX(1)` en `.55s var(--ease)`. El botón lleva `position:relative; isolation:isolate; overflow:hidden` y el `::before` va en `z-index:-1`.
- `dark`: fondo `--brown`, texto blanco; el relleno es `--brown-hover`.
- `light`: fondo **blanco** (nunca transparente), texto `--brown`, borde `rgba(59,40,16,.45)`; el relleno es `--brown` y el texto pasa a blanco.
- Si llevan flecha, la flecha se mueve 4px a la derecha en hover.
- Foco visible: `outline: 2px solid var(--gold-line); outline-offset: 4px`.

### Vídeo en iPhone (muy importante)
Ahora en iPhone se ve el fondo y el círculo con el botón de play. Corrígelo así y **verifícalo**:

1. **Recodifica el vídeo** para que Safari iOS lo reproduzca sin problemas (H.264, 8 bits, `yuv420p`, sin audio, `faststart`):
   ```bash
   ffmpeg -y -i assets/<video-original>.mp4 \
     -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -level 4.0 \
     -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart -an \
     public/video/hero.mp4
   ffmpeg -y -i assets/<video-original>.mp4 \
     -vf "scale=1280:-2,fps=30" -c:v libx264 -profile:v main -level 3.1 \
     -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart -an \
     public/video/hero-720.mp4
   ffmpeg -y -ss 0.5 -i public/video/hero.mp4 -frames:v 1 -q:v 3 public/video/hero-poster.jpg
   ```
   Comprueba el resultado con `ffprobe public/video/hero.mp4`: debe decir `h264`, `yuv420p`, sin pista de audio. Si `ffmpeg` no está instalado, avísame y para.
2. **Marcado** (todos los atributos son obligatorios en iOS):
   ```html
   <video class="hero-video" autoplay muted loop playsinline webkit-playsinline
          preload="auto" disablepictureinpicture disableremoteplayback
          poster="/video/hero-poster.jpg" aria-hidden="true" tabindex="-1">
     <source src="/video/hero-720.mp4" type="video/mp4" media="(max-width: 900px)">
     <source src="/video/hero.mp4" type="video/mp4">
   </video>
   ```
   Escribe los atributos booleanos tal cual (`muted`, no `muted="false"` ni `muted={variable}`).
3. **Script de arranque** (dentro del script del hero, ejecutado en `astro:page-load`, porque con `ClientRouter` el autoplay no se dispara solo al volver a la home):
   ```js
   const v = document.querySelector('.hero-video');
   if (v) {
     v.muted = true; v.defaultMuted = true; v.playsInline = true;
     v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
     const p = v.play();
     if (p && p.catch) p.catch(() => v.closest('.hero')?.classList.add('no-video'));
   }
   ```
4. **Ocultar el botón de play nativo** de iOS (aparece en modo Ahorro de batería, cuando iOS bloquea el autoplay):
   ```css
   .hero-video::-webkit-media-controls-start-playback-button { display:none !important; -webkit-appearance:none; }
   .hero-video::-webkit-media-controls { display:none !important; }
   .hero.no-video .hero-video { display:none; }
   .hero { background: #E9EFEC url('/video/hero-poster.jpg') center/cover no-repeat; }
   ```
   Así, si el vídeo no puede arrancar, se ve el póster como imagen fija, nunca el círculo de play.
5. Comprueba que Netlify sirve el vídeo con `Content-Type: video/mp4` (sin redirecciones ni compresión que rompan las peticiones por rangos).
6. **Prueba real**: `npm run build && npx astro preview --host` y abre la IP local en un iPhone (Safari), o usa la URL de preview de Netlify. Prueba con el modo Ahorro de batería activado y desactivado. Dime el resultado.

---

## 5. Secciones: flechas de los sliders y fondos neutros

### Flechas nuevas (todos los sliders: Servicios, Extras, Plataforma, Testimonios y los de páginas internas)
- Quita las flechas gruesas a los lados de las imágenes.
- Pon dos botones cuadrados **en la cabecera de la sección, a la derecha**, alineados abajo con el título (en móvil, debajo del título):
  - `width:58px; height:58px; border-radius:2px; border:1px solid rgba(59,40,16,.45); background:#fff; color: var(--brown)`.
  - Flecha fina: SVG 22px, `stroke-width:1.5`.
  - Hover: fondo `--brown`, flecha blanca, transición `.4s var(--ease)`.
  - Separación entre los dos botones: 12px.
  - Mantén los `aria-label` actuales y el desplazamiento con `scrollBy`.
- Testimonios: las mismas flechas, colocadas a ambos lados de los indicadores. Los indicadores pasan a ser rayas de 2px de alto (16px inactiva, 36px activa en `--gold-line`), con área táctil de 44px.

### Fondos: color neutro en lugar de la textura de papel
Elimina la textura de papel beige de **todas** las secciones donde está (cabecera, Nuestros servicios, Nosotros, Servicios extra, Blog, FAQ y la mitad del formulario de Acceso) y usa colores lisos:

| Sección | Fondo |
|---|---|
| Nuestros servicios | `--ivory` |
| Nosotros | `--cream` |
| Servicios extra | `#FFFFFF` |
| Blog | `#FFFFFF` |
| FAQ | `--cream` |
| Acceso (mitad del formulario) | `--cream` |
| Cabeceras de páginas internas: el degradado inferior de la foto | se funde con el color de la sección siguiente |

Las secciones que hoy llevan textura gris **no cambian** (punto 6). Borra el archivo de la textura de papel de `src/assets/images/` solo si ya no se usa en ningún sitio.

---

## 6. Textura gris: se mantiene donde estaba

La textura gris de luces y sombras se queda **exactamente igual**: imagen al 55 % sobre `--silver-base` (#EDEDEC), con `::before` y `z-index:-1`, en:

- Reserva online (los seis pasos),
- La plataforma,
- Testimonios,
- Contacto.

No la sustituyas por ningún color liso.

---

## 1. Animaciones al hacer scroll

### Revelado de secciones
- Atributo en los elementos: `data-reveal="up" | "left" | "right"` y opcional `data-reveal-delay="1|2|3"` (0,12 s, 0,24 s y 0,36 s).
- CSS en `global.css`:
  ```css
  html.js [data-reveal] { opacity:0; transform:translateY(50px);
    transition: opacity .85s var(--ease), transform .85s var(--ease); }
  html.js [data-reveal="left"]  { transform:translateX(-70px); }
  html.js [data-reveal="right"] { transform:translateX(70px); }
  html.js [data-reveal].is-in   { opacity:1; transform:none; }
  html.js [data-reveal-delay="1"] { transition-delay:.12s; }
  html.js [data-reveal-delay="2"] { transition-delay:.24s; }
  html.js [data-reveal-delay="3"] { transition-delay:.36s; }
  @media (prefers-reduced-motion: reduce) {
    html.js [data-reveal] { opacity:1 !important; transform:none !important; transition:none !important; }
  }
  ```
- En el `<head>` de `BaseLayout`, un script inline mínimo: `document.documentElement.classList.add('js')`. Sin JavaScript, todo se ve normal.
- Script (`src/scripts/reveal.ts`), inicializado en `astro:page-load` y desconectado en `astro:before-swap`: un `IntersectionObserver` con `rootMargin: '0px 0px -80px 0px'` y `threshold: 0.08` que añade `.is-in` y deja de observar el elemento.
- Dónde aplicarlo:
  - Cabeceras de sección: el bloque de eyebrow + título con `left`; el párrafo o las flechas de la derecha con `right` y delay 1.
  - Tarjetas de rejillas y artículos del blog: `up`, con delays 0, 1 y 2 por columna.
  - Sliders: el contenedor entero con `up` (no cada tarjeta).
  - Foto grande de Nosotros y foto de los seis pasos: `up` / `left`.
  - Nada dentro del hero (ver abajo).
- Ojo: si un elemento con `data-reveal` también tiene `transform` en hover (p. ej. una tarjeta que sube), define el hover con más especificidad (`[data-reveal].is-in:hover`) para que siga funcionando.

### Animaciones del hero (al cargar, no al hacer scroll)
- Vídeo: entra con un fundido y una escala de 1.04 a 1 en 1,6 s.
- Eyebrow: baja 14px y aparece (0,8 s, retraso 0,1 s).
- H1 letra a letra: genera en el componente un `<span class="wave">` por letra (y un `<span>` con `white-space:nowrap` por palabra, para que no se parta), con `animation-delay` creciente de 0,045 s empezando en 0,35 s. Keyframes: desde `opacity:0; transform: translateY(.55em) rotate(4deg)` hasta su sitio, 0,9 s `var(--ease)`. El `<h1>` lleva `aria-label` con el texto completo y los spans `aria-hidden="true"`.
- Párrafo y botones: suben 18px y aparecen (0,9 s; retrasos 1,15 s y 1,35 s).
- Indicador de scroll: aparece a los 1,9 s y la línea «gotea» en bucle (`scaleY` 0→1→0 cambiando `transform-origin` de arriba a abajo, 2,4 s).
- Todo desactivado con `prefers-reduced-motion: reduce`.

### Microinteracciones (CSS)
- Imágenes de tarjetas y del blog: `transform: scale(1.05)` en hover, 1,1 s `var(--ease)`, dentro de un contenedor con `overflow:hidden`.
- Enlaces de texto tipo «Ver todos los artículos»: línea en `--gold-line` que crece de 28px al 100 % en hover.
- FAQ: el «+» es una cruz de líneas finas en `--bronze` que gira 45° al abrir.

---

## Comprobación final

1. `npm run build` sin errores ni avisos nuevos.
2. Recorre todas las páginas a 390px, 768px, 1280px y 1920px: sin scroll horizontal, cabecera en una sola línea en escritorio, nada tapado por la cabecera fija.
3. Contraste: ningún texto en `--gold-line` sobre fondo claro. Textos sobre el vídeo legibles.
4. Activa «Reducir movimiento» en el sistema: todo aparece sin animación.
5. Vídeo del hero probado en un iPhone real (con y sin Ahorro de batería) y en Android.
6. Navega a otra página y vuelve a Inicio: el vídeo sigue reproduciéndose y las animaciones funcionan.
7. Actualiza `CLAUDE.md` §6 con este sistema y dame un resumen de los archivos modificados.
