import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { devComponentIdPlugin } from './__phantom_dev_tools.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap(), react()],
  image: {
    // Use Sharp for image optimization (WebP/AVIF conversion)
    service: { entrypoint: 'astro/assets/services/sharp' },
    // Allow images from WordPress (fallback if not downloaded locally)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'miniondonuts.com',
      },
      {
        protocol: 'http',
        hostname: 'miniondonuts.com',
      },
      {
        // Allow common CDN patterns for WordPress
        protocol: 'https',
        hostname: '*.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
    ],
  },
  server: {
    // Bind to all interfaces so Codespaces port forwarding can reach the dev server
    host: true,
    // Allow Codespaces reverse proxy hostname (Vite 6.2+ rejects unknown hosts by default)
    allowedHosts: ['.app.github.dev'],
  },
  vite: {
    plugins: [tailwindcss(), devComponentIdPlugin()],
    server: {
      headers: {
        // Allow iframe embedding in development only (for IDE preview)
        'Content-Security-Policy': "frame-ancestors *",
      },
      // HMR configuration for GitHub Codespaces
      hmr: {
        clientPort: 443,
        protocol: 'wss',
      },
      watch: {
        // Use native file watchers (faster than polling)
        // If you experience issues in containers, set usePolling: true
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.output/**'],
      },
    },
  },
});
