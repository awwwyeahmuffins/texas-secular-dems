// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to your final custom domain once registered.
export default defineConfig({
  site: 'https://texasseculardems.org',
  integrations: [sitemap()],
});
