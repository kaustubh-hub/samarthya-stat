import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    // `npm run dev` (UI) + `npm run server` (API) — forward /api to the agent server
    proxy: { '/api': 'http://localhost:8787' }
  }
})
