import { defineConfig } from 'vitest/config'

// Browser APIs (window, document, navigator) are simulated via happy-dom.
// For window.ethereum and other injected providers, use the mock helper in
// src/test/utils/ethereum-mock.ts — see that file for the pattern.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
})
