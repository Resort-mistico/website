import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssMinify: true,
    assetsInlineLimit: 4096, // inline assets < 4kb como base64
    reportCompressedSize: false, // build mais rápido
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('quill') || id.includes('react-quill')) {
              return 'vendor-quill'
            }
            return 'vendor'
          }
        },
        // Garante nomes de asset com hash para cache busting correto
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
