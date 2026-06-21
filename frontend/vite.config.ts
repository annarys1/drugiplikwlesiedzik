import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8802,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://backend:8801',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
