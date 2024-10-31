import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: '/',
  // Add this section
  assetsInclude: ['**/*.html'],
  // Copy _redirects and _headers to dist
  publicDir: 'public',
});
