import { defineConfig } from 'astro/config';

// Set SITE_URL when deploying (for example https://yourname.com) so share cards and canonical links are absolute.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  build: { inlineStylesheets: 'auto' },
});
