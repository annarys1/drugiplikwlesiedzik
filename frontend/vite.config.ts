import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8802, // Upewnij się, że frontend startuje na tym porcie
    proxy: {
      '/api': {
        target: 'http://localhost:8801', // Tu kierujemy zapytania
        changeOrigin: true,
        secure: false,
      },
    },
  },
});