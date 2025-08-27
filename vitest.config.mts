import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nextImageStub } from './vitest/plugins/nextImageStub'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react(), nextImageStub()],
  test: {
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '.next/**',
        '__tests__/**',
        '**/*.config.*',
        '**/node_modules/**',
        '**/layout.tsx',
        '**/types/**',
        'vitest/plugins/**',
        'app/data/**',
      ],
    },
  },
})