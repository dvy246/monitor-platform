import { defineConfig } from 'astro/config';
import tailwindcv4 from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://monitortesthub.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      filter: (page) => !page.includes('/cdn-cgi/')
    })
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcv4()]
  },
  output: 'static'
});
