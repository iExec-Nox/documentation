import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Asset imports (SVGs) from chain.utils.ts need to resolve as strings under
  // Vitest so `getSupportedChains()` does not throw at import time.
  assetsInclude: ['**/*.svg'],
});
