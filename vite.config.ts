import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('supabase')) return 'supabase'
            if (id.includes('@tanstack')) return 'router'
            if (id.includes('@radix-ui')) return 'ui'
            if (id.includes('recharts')) return 'charts'
            if (id.includes('react-dom')) return 'react-dom'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
          if (id.includes('src/lib/products')) return 'products'
        }
      }
    }
  }
})