import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/doctor/',
  build: {
    outDir: '../dist/doctor',
    emptyOutDir: true
  },
  plugins: [react()],
})
