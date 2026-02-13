/**
 * Vitest global setup file
 * 
 * This file runs before vitest tests. Since vitest tests run in jsdom environment
 * (not a full VS Code instance), we don't install actual extensions here.
 * Instead, we ensure mocks are properly configured.
 */

// Any global test setup can go here
// For example, setting up global test utilities, polyfills, etc.

console.log('Vitest setup complete');
