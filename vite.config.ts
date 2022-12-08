import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
      fileName: 'index',
    },

    rollupOptions: {
      external: ['vscode'],
    },
  },

  define: {
    'import.meta.vitest': false,
  },

  test: {
    includeSource: ['src/**/*.ts'],
  },
})
