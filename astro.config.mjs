// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL ?? 'https://reyadhasnain.com';

export default defineConfig({
  site: SITE,

  // Static-first: every page prerenders at build time. Only the contact API
  // route and the dynamic OG image route opt into SSR via `export const prerender = false`.
  output: 'static',

  // Vercel adapter — runs the SSR routes as Vercel serverless functions.
  // `imageService: true` enables Vercel's built-in Sharp-on-the-edge image optimization
  //   (used by Astro's <Image> component when we add real assets).
  // `webAnalytics.enabled: true` injects Vercel's privacy-friendly analytics script
  //   (free, no cookie banner needed).
  // `isr` caches dynamic SSR responses at the edge — the OG image is a perfect candidate.
  adapter: vercel({
    imageService: true,
    webAnalytics: { enabled: true },
    isr: {
      // Revalidate dynamic responses every 24h. The contact API opts out via
      // its `Cache-Control: no-store` header.
      expiration: 60 * 60 * 24,
    },
    // Vercel functions default to iad1 (US East). Pin closer to the audience —
    // Reyad's audience is split between Bangladesh and global tech capitals.
    // sin1 = Singapore, the closest Vercel region to Dhaka.
    // Comment this out if you want US East default.
    // functionPerRoute: false,
  }),

  integrations: [
    react(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Nodemailer is a Node-only package; tell Vite not to try bundling it.
      external: ['nodemailer'],
    },
  },

  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{ protocol: 'https' }],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  build: {
    inlineStylesheets: 'auto',
  },

  server: {
    host: true,
    port: 4321,
  },
});
