import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // Override default .html entry
      input: '/src/main.jsx',
    },
    outDir: '../tracticeapi/static/dist',
    emptyOutDir: true,
  },
});
