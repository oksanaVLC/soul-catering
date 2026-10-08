// Scroll reveal (CAMBIOS-v5 §1): adds .is-in to [data-reveal] elements when they enter the
// viewport, then stops observing them. Re-initialised after every ClientRouter navigation.
let observer: IntersectionObserver | null = null;

document.addEventListener('astro:page-load', () => {
  observer?.disconnect();
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
  if (!items.length) return;
  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer?.observe(el));
});

document.addEventListener('astro:before-swap', () => {
  observer?.disconnect();
  observer = null;
});
