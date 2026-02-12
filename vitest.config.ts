import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            // Mock vscode module for testing
            'vscode': path.resolve(__dirname, 'test/__mocks__/vscode.ts')
        }
    },
    test: {
        // Match test files using common patterns
        include: ['test/**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/dist-test/**', 'test/integration/**'],

        // Use jsdom environment for browser-like testing
        environment: 'jsdom',

        // Global test timeout
        testTimeout: 10000,

        // Setup files
        setupFiles: ['./test/vitest-setup.ts'],

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