import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // vite-plugin-svgr options
      include: '**/*.svg',
    }),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Enable polyfills for these Node.js modules
      protocolImports: true,
    }),
  ],
  define: {
    // Required for some packages that expect global to be defined
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Support absolute imports from src directory like Create React App
      // This maps any import without ./ or ../ to the src directory
      App: path.resolve(__dirname, 'src/App'),
      services: path.resolve(__dirname, 'src/services'),
      components: path.resolve(__dirname, 'src/components'),
      modules: path.resolve(__dirname, 'src/modules'),
      utils: path.resolve(__dirname, 'src/utils'),
      theme: path.resolve(__dirname, 'src/theme'),
      assets: path.resolve(__dirname, 'src/assets'),
      models: path.resolve(__dirname, 'src/models'),
      config: path.resolve(__dirname, 'src/config'),
    },
  },
  assetsInclude: ['**/*.md'], // Treat .md files as assets
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Increase chunk size warning limit if needed
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'buffer',
    ],
  },
  envPrefix: ['VITE_', 'REACT_APP_'], // Allow both VITE_ and REACT_APP_ prefixes
})