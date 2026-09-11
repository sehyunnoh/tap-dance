/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://sehyunnoh.github.io/tap-dance/
  base: '/tap-dance/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
  },
})
