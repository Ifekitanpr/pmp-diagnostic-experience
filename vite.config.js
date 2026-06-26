import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/pmp-diagnostic-experience/',
  plugins: [react()],
})
