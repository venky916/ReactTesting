import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    // 🔥 EXCLUDE E2E TESTS - They run with Playwright!
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',                    // ✅ Don't run e2e folder
      '**/*.spec.ts',                 // ✅ Don't run .spec.ts files
      '**/.{idea,git,cache,output,temp}/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],

    // ✅ ONLY include unit/integration tests
    include: [
      'src/**/*.test.{ts,tsx}',       // ✅ Only .test.ts in src
    ],

    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      // ✅ MINIMUM THRESHOLDS
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      // 📁 What to include/exclude
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/**',                      // ✅ Don't measure E2E coverage
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.spec.ts',                // ✅ Exclude E2E test files
        '**/mockData/',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      // 📊 Report output
      reportsDirectory: './coverage',
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})


// 🎓 CONFIGURATION EXPLAINED:
//
// exclude: Files Vitest should IGNORE
//   - e2e/** = All E2E test files (Playwright handles these)
//   - *.spec.ts = Playwright test files (use .test.ts for Vitest)
//
// include: Files Vitest should RUN
//   - src/**/*.test.{ts,tsx} = Only unit/integration tests
//
// coverage.exclude: Don't measure coverage for E2E
//   - E2E tests measure different things
//   - Keep coverage focused on unit/integration
//
// 🎯 RESULT:
// - npm test → Only runs .test.ts files (Vitest)
// - npm run test:e2e → Only runs .spec.ts files (Playwright)
// - Clean separation! No conflicts!