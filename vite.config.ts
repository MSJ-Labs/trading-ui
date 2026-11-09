import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Everything the browser sends to the BFF (8081): API, identity, OIDC login/logout.
      // changeOrigin rewrites Host to localhost:8081 so the redirect_uri built by Spring
      // matches the one registered in Keycloak.
      '/api': { target: 'http://localhost:8081', changeOrigin: true },
      '/bff': { target: 'http://localhost:8081', changeOrigin: true },
      '/oauth2': { target: 'http://localhost:8081', changeOrigin: true },
      '/logout': { target: 'http://localhost:8081', changeOrigin: true },
      // TEMPORARY: price stream still goes straight to trading-core (option B: secure it separately).
      '/ws': { target: 'http://localhost:8080', ws: true, changeOrigin: true },
    },
  },
})