import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Match test files using common patterns
        include: ['test/manifest.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/dist-test/**', 'test/integration/**'],

        // Use jsdom environment for browser-like testing
        environment: 'jsdom',

        // Global test timeout
        testTimeout: 10000,

        // Setup files (if needed later)
        // setupFiles: ['./test/setup.ts'],

        // Enable globals like describe, it, expect
        globals: true,

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                'dist-test/',
                'lib*/',
                'types/',
                'test/',
                '**/*.d.ts',
                'esbuild.mjs',
                '**/*.config.{js,ts,mjs}',
                '**/coverage/**'
            ]
        },

        // Reporter configuration
        reporters: ['verbose', 'junit'],
        outputFile: {
            junit: './test-results.xml'
        }
    }
})