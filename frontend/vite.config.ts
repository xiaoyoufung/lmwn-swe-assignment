import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { env } from 'process'

// https://vite.dev/config/
export default defineConfig({
  server:{
    cors:true
  },
  plugins: [react(), tailwindcss()],
  // Make environment variables available
    define: {
      'import.meta.env.BACKEND_PORT': JSON.stringify(
        env.BACKEND_PORT || 'http://localhost:3200/api'
      ),
    },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
