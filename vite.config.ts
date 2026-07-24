import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          swiper: ['swiper'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    port: 5173,
    host: true,
  },
});
