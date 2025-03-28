import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  base: '/',
  // This ensures the _redirects file is copied to dist
  publicDir: 'public',
});
