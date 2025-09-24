# Copilot Project Instructions (vscode-ecl)

These instructions give AI coding agents the minimum project-specific context needed to be productive. Keep answers concise, reference concrete files, and follow existing patterns.

## 1. Project Purpose & Top-Level Architecture

VS Code extension providing HPCC Systems ECL/KEL/Dashy language + notebook + platform workflow support. Core responsibilities:

- Language support (syntax, syntax checking, snippets, record definition insertion)
- Workunit submission & monitoring against HPCC Platform clusters
- KEL -> ECL generation workflow
- ECL Notebook (.eclnb) execution + custom renderers (Workunit + ObservableJS)
- Auxiliary dashboard / ECL Watch webview UI

Architecture overview:

- Entry points: `src/extension.ts` (Node runtime), `src/web-extension.ts` (browser/web). Both dynamically import feature modules after localization init.
- Feature modules (lazy loaded): `src/ecl/`, `src/kel/`, `src/notebook/`, optional `dashy/` (currently commented in extension.ts) plus UI components in `src/eclwatch.tsx`.
- Build outputs to `dist/` (extension + web renderers) and `dist-util/` (docs vector DB generator) via `esbuild.mjs`.
- Grammar + syntax: `ecl-tmLanguage/`, `syntaxes/kel.tmLanguage.json`, `syntaxes/dashy.tmLanguage.json`.
- Internationalization: strings resolved through `./util/localize` and `nls` JSON generation (`npm run gen-nls`).

## 2. Build & Dev Workflow

Primary scripts (`package.json`):

- Type generation (watch): `npm run gen-node-watch`, `npm run gen-webview-watch` (tsc emit d.ts only per config).
- Bundle dev watch (all): run VS Code build task (maps to `build` task which depends on `gen-node-watch`, `gen-webview-watch`, `build-ts-watch`).
- One-off production build: `npm run build` (runs `gen-types` + `build-ts`).
- Lint: `npm run lint` / auto-fix: `npm run lint-fix`.
- Testing: `npm run test:vitest` (watch), `npm run test:vitest-run` (once), `npm run test:vitest-ui` (with UI), `npm run test:vitest-coverage` (with coverage).
- Package VSIX: `npm run package` (output `ecl.vsix`).
- Publish (requires auth): `npm run publish`.
- Generate localized resources: `npm run gen-nls` then `npm run merge-nls` if needed.
- Vector doc index (LLM prompt support): `npm run gen-docs-vecdb` (writes `dist/docs.vecdb`).

Typical dev loop:

1. Run default build task (Ctrl+Shift+B) for watch mode.
2. Launch extension host (F5). Open an `.ecl` or `.kel` file to trigger activation.
3. Modify sources under `src/`; esbuild watch rebuilds to `dist/` automatically.

## 3. Key Extension Contributions (from `package.json`)

- Languages: ECL (`.ecl`, `.mod`, `.ecllib`), KEL (`.kel`), Dashy (`.dashy` JSON injection grammar).
- Commands & menus are heavily context-driven (see `package.json` for enablement). Do not hardcode strings—reuse existing command IDs.
- Notebooks: id `ecl-notebook`; renderers `wuRenderer` (Workunit JSON) and `ojsRenderer` (ObservableJS cells).
- Debugger type: `ecl` (program `dist/debugger.js`) with launch schema documented in README.
- Chat participant: `chat.ecl` —prefer expanding these via contributes if adding capabilities.

## 4. Source Layout & Patterns

- Dynamic imports keep activation fast; new feature areas should follow pattern in `extension.ts` (lazy import after `initialize()`).
- Prefer colocated feature folders: `src/<domain>/main.ts|js` exporting `activate(context)` consumed by entry point.
- Webview / browser-targeted code uses `tsconfig.webview.json` (ESM / browser target) vs Node code using root `tsconfig.json` (CJS target). Match platform when adding entrypoints.
- React (v17) used for complex UI (`eclwatch.tsx`, notebook renderers). Use function components + hooks; avoid introducing different UI libs.
- Telemetry encapsulated in `src/telemetry/`; send only via exported `reporter` to keep consistency.
- **Prefer VS Code APIs over Node.js APIs**: Use `vscode.workspace.fs` for file operations, `vscode.Uri` for paths, and VS Code's built-in utilities where available. This ensures better integration with the VS Code environment, proper workspace context, and compatibility with both Node and web environments.

## 5. Localization & Strings

- New user-facing strings should use localization pipeline: add to base `package.nls.json`, run `npm run gen-nls` (creates `lib-util/generate.js` output consumed) then reconcile missing entries under `tmp/package.nls.*.missing.json` before commit.
- Avoid embedding raw UI strings directly in TSX—centralize when reused or visible.

## 6. HPCC Platform Integration

- Workunit operations & platform APIs housed under `src/hpccplatform/` and supporting util modules (look for submission, polling, and tree view providers). Follow existing async patterns (Promise-based, minimal global state, use VS Code `TreeDataProvider`).
- Submission UI flows rely on status bar selections (launch config + target cluster) + tree updates; keep side effects isolated.

## 7. Notebooks & Renderers

- Notebook kernel / controller logic under `src/notebook/` (activation imported in both node + web builds).
- Renderer isolation: each renderer is a separate esbuild entry (see `esbuild.mjs`). Add new renderer by adding another `main(tsconfigBrowser, entry, "browser", format)` call and corresponding `notebookRenderer` contribution.

## 8. Adding Features Safely

- Reuse existing command categories (`ECL`, `KEL`) and enablement contexts (e.g. `ecl.connected`).
- Extend menus via existing submenus `setState`, `setPriority` when dealing with workunits rather than creating new ones.
- For network/platform code, respect existing configuration settings (e.g. proxy, `rejectUnauthorized`).

## 9. Testing & Quality

- **Vitest** is now configured as the primary testing framework (`vitest.config.ts`). Legacy mocha tests remain in `test/` but are excluded from vitest runs.
- New tests should be placed in `src/__tests__/` using `*.test.ts` or `*.spec.ts` naming convention.
- Available vitest commands:
  - `npm run test:vitest` - Run tests in watch mode
  - `npm run test:vitest-run` - Run tests once
  - `npm run test:vitest-ui` - Run tests with UI
  - `npm run test:vitest-coverage` - Run tests with coverage report
- Vitest config includes jsdom environment, global test functions (`describe`, `it`, `expect`), and coverage reporting.
- Keep new logic unit-testable (pure functions in util modules). Avoid coupling VS Code API calls inside deep logic—wrap them.
- See `src/__tests__/vitest-example.test.ts` for testing patterns including mocks, timers, DOM manipulation, and async operations.

## 10. Bundling Constraints

- External modules declared in `esbuild.mjs` (e.g. `vscode`, core node modules) must remain external. When introducing node-only deps ensure they aren’t required by browser bundles.
- Browser targets must avoid Node APIs unless polyfilled (current config doesn’t inject shims).

## 11. Vector Doc Index

- File `util/docs.vecdb` copied into `dist/docs.vecdb` for LLM/assistant usage. Updating generation logic: edit `util/index-docs.ts`, rebuild with production flag or run `node dist-util/index-docs.mjs` via script.

## 12. Versioning & Packaging

- Extension version in `package.json`—increment appropriately; run `npm run package` to produce `ecl.vsix`. Publishing uses `vsce publish` (ensure changelog updated).

## 13. Common Pitfalls

- Forgetting lazy import => increases activation time (avoid exporting heavy modules directly from entry point).
- Mixing web + node code (ensure correct tsconfig target and esbuild platform entry).
- Adding untranslated strings (will produce missing locale JSON files under `tmp/`).

When responding, cite file paths (e.g. `src/extension.ts`) and align with these established patterns. If uncertain, inspect `package.json` contributions first.

## 14. VS Code API Reference Shortcuts

Use official docs for API details; below are the most relevant entry points for this project’s common tasks:

- Extension Manifest (`package.json` contributes): https://code.visualstudio.com/api/references/contribution-points
- Core VS Code API (activation, commands, TreeDataProvider, status bar): https://code.visualstudio.com/api/references/vscode-api
- Debug Adapter & Debugger contributions (used for `type: "ecl"`): https://code.visualstudio.com/api/extension-guides/debugger-extension
- Notebook API (controller, renderers): https://code.visualstudio.com/api/extension-guides/notebook
- Webview UI (used by `eclwatch.tsx` and potential Dashy views): https://code.visualstudio.com/api/extension-guides/webview
- Localization (NLS): https://code.visualstudio.com/api/advanced-topics/localization

How to apply:

- Before adding a new contribution, confirm an existing pattern in `package.json` (e.g. replicate a command object, adjust `enablement`).
- For a new Tree View / data provider, follow existing HPCC platform tree patterns under `src/hpccplatform/` and reference TreeDataProvider docs.
- For new notebook renderer: add entry in `esbuild.mjs` (browser target) + `notebookRenderer` contribution + MIME type contract.
- For status bar interactions replicate existing approach (search for usages setting `ecl.launchConfiguration` & `ecl.targetCluster`).

When unsure of an API surface (e.g. `WorkspaceEdit`, `TextDocumentContentProvider`, etc.) prefer stable APIs listed in the vscode-api reference; avoid proposed APIs unless already adopted in this repo.

## 15. Reference Sample Extensions

For additional concrete, minimal examples of specific VS Code features (debug adapters, notebooks, webviews, tree views, authentication, testing, etc.), consult the official extension samples repository:

https://github.com/microsoft/vscode-extension-samples

Use these samples to validate API usage patterns before introducing new dependencies. Align any adopted patterns with this project's existing conventions (lazy dynamic imports in `src/extension.ts`, localization via `package.nls.json`, separation of Node vs browser bundles, and avoiding proposed APIs unless already in use).
