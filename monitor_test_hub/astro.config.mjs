import { defineConfig } from 'astro/config';
import tailwindcv4 from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://displaytestonline.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/cdn-cgi/') && !page.includes('/embed/') && !page.includes('/404') && !page.includes('/500') && !page.includes('/badge.svg'),
      serialize(item) {
        const url = item.url;
        if (url === 'https://displaytestonline.com/' || url.endsWith('/es/') || url.endsWith('/de/') || url.endsWith('/fr/')) {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (
          url.includes('/display-tests/') || 
          url.includes('/touch-tests/') || 
          url.includes('/input-tests/') || 
          url.includes('/keyboard-tester/') ||
          url.includes('/benchmarks/') ||
          url.includes('/audio-tests/') ||
          url.includes('/models/')
        ) {
          item.changefreq = 'daily';
          item.priority = 0.9;
        } else if (
          url.includes('/white-screen/') || 
          url.includes('/touch-matrix/') || 
          url.includes('/guides/') || 
          url.includes('/vrr-stutter-test/') || 
          url.includes('/oled-burn-in-risk/') || 
          url.includes('/hdr-test/') || 
          url.includes('/input-lag-test/') ||
          url.includes('/arcade/')
        ) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (
          url.includes('/terms') || 
          url.includes('/privacy') || 
          url.includes('/contact') || 
          url.includes('/about')
        ) {
          item.changefreq = 'monthly';
          item.priority = 0.3;
        } else {
          item.changefreq = 'weekly';
          item.priority = 0.7;
        }
        return item;
      }
    })
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  build: {
    concurrency: 1,
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcv4()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: () => 'shared'
        }
      }
    }
  },
  output: 'static'
});
