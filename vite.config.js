import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/supabase': {
        target: 'https://zuczpzcagufmufjpubjo.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
        secure: false,
      },
    },
  },
})
