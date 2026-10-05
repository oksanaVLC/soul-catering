// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Provisional: replace with the real domain when one exists
  site: 'https://soul-catering.example',
  integrations: [
    mdx(),
    // Internal areas (manager access and panel) are left out of the sitemap.
    sitemap({ filter: (page) => !/^\/(?:(?:en|fr|ru)\/)?(?:acceso|panel)(?:\/|$)/.test(new URL(page).pathname) }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr', 'ru'],
    routing: { prefixDefaultLocale: false },
  },
});
