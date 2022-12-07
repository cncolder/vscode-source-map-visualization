import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'import.meta.vitest': false,
  },

  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
      fileName: 'index',
    },

    rollupOptions: {
      external: ['vscode'],
    },

    sourcemap: true,

  },

  test: {
    environment: 'jsdom',

    includeSource: ['src/**/*.ts'],
  },
})
