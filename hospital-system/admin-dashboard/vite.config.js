import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true
  },
  plugins: [react()],
})
