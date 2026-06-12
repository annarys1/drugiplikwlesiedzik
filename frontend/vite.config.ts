import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8802, 
    proxy: {
      '/api': {
        target: 'http://149.156.194.192:8801',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})