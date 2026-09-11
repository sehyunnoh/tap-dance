/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://sehyunnoh.github.io/tap-dance/
  base: '/tap-dance/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Libraries and each level's step data get their own files, so a data update
        // only re-downloads the level that changed.
        codeSplitting: {
          groups: [
            { name: 'vendor', test: /node_modules/ },
            {
              name: (id: string) => {
                const level = /data[\\/]steps[\\/]level-(\d)\.json/.exec(id)?.[1]
                return level ? `steps-${level}` : null
              },
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
  },
})
