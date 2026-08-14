import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true
  },
  server: {
    port: 5174,
    proxy: {
      '/admin': {
        target: 'http://localhost:5175',
        changeOrigin: true
      },
      '/doctor': {
        target: 'http://localhost:5176',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
})
