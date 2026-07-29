import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /<repo>/, so the asset base must be
// prefixed there but stay at the root for Vercel and local development.
const repoName = 'Kapsomoita-Church-Website'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : '/',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Mirrors the "@/*" path in tsconfig.app.json. Keep both in sync.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    // Fail loudly rather than silently moving to another port, which would break
    // the backend's CORS allow-list.
    strictPort: true,
    proxy: {
      // Lets the dev frontend call /api/* same-origin, avoiding CORS entirely
      // while developing. Production uses VITE_API_URL against the deployed API.
      '/api': {
        target: process.env.VITE_DEV_API_PROXY ?? 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_DEV_API_PROXY ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Raised because the vendor chunks below are legitimately large; the warning
    // at the default 500 kB would fire on every build and stop being useful.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        /*
         * Split long-lived vendor code out of the app bundle so a content change
         * does not invalidate React, the router and the chart library in every
         * returning visitor's cache.
         */
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query', 'axios'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'motion-vendor': ['framer-motion'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
})
