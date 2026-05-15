import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Detecton URL
      // Redirige vers le PHP (le port 8000)
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/quizzes': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/studio': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        xfwd: true
      },
      '/rooms': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        xfwd: true
      }
    }
  }
})