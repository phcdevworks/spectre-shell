# Changelog

All notable changes to this project will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning reflects package releases.

## [Unreleased]

## [1.6.0] - 2026-09-06

**Release Title:** Bootstrap Readiness and Integration Checks

Contract change type: semantic change

### Fixed

- Reset `bootReady` before each bootstrap attempt so a failed restart no longer
  retains readiness from a previous successful startup.

### Changed

- Clarified synchronous shell readiness, plugin execution order, restart
  ownership, and the distinction between `afterMount` and route rendering.
- Replaced mocked-router package smoke coverage with real-router checks for
  delayed rendering, lifecycle option forwarding, and failed restarts; added
  regression coverage for readiness reset and the `afterMount` error boundary.
- Added example typechecking and production builds to both CI runtime jobs.
- Aligned development and automation documentation with the public options and
  current git authority policy.

## [1.5.0] - 2026-09-04

Release Title: Router Options Pass-through

Contract change type: additive

### Added

- Added optional `BootstrapOptions.routerOptions`, forwarded unchanged to the
  router constructor. Downstream applications can now configure router
  lifecycle hooks and other supported router options through `bootstrapApp()`.

## [1.4.0] - 2026-08-10

Release Title: Dependency Baseline Refresh

Contract change type: semantic change

### Changed

- Raised the Spectre runtime dependency baselines to
  `@phcdevworks/spectre-shell-router` `^1.4.0`,
  `@phcdevworks/spectre-shell-signals` `^1.3.0`,
  `@phcdevworks/spectre-tokens` `^4.3.0`, and
  `@phcdevworks/spectre-ui` `^4.0.0`.
- Refreshed the npm and development-tool dependency baselines and regenerated
  the lockfile.
- Consolidated completed roadmap and TODO history around the current
  demand-driven work queue.
- Removed roadmap phase prefixes from changelog and GitHub release titles and
  updated release guidance to keep future titles phase-free.

## [1.3.0] - 2026-07-22

Release Title: TypeScript 7 Compatibility

Contract change type: additive

### Changed

- Added a `typescript` peer dependency range, `^5.0 || ^6.0 || ^7.0`, and
  moved the build and typecheck commands to TypeScript 7's native compiler via
  the `@typescript/native` devDependency alias. ESLint tooling continues to
  resolve TypeScript 6 through an `npm:@typescript/typescript6` alias because
  `typescript-eslint` does not yet support TypeScript 7's programmatic API;
  `typescript-eslint` was also bumped to `^8.65.0`.
- Updated the Spectre runtime dependency baselines to
  `@phcdevworks/spectre-shell-router` `^1.3.0`,
  `@phcdevworks/spectre-shell-signals` `^1.2.0`,
  `@phcdevworks/spectre-tokens` `^3.5.0`, and
  `@phcdevworks/spectre-ui` `^2.10.0`.

## [1.2.0] - 2026-07-07

Release Title: Ecosystem Integration

Contract change type: additive

### Changed

- Bumped `@phcdevworks/spectre-tokens` to `^3.3.1` and `@phcdevworks/spectre-ui`
  to `^2.7.1`, closing dependency drift against the current published
  `project-design` packages. Both upstream releases were additive only — no
  source changes required here.

### Fixed

- Added `@types/node` as a devDependency so `scripts/check-readme-version.ts`
  resolves Node globals correctly (no functional impact — script already ran
  fine via `node --experimental-strip-types`, this only affects editor/IDE
  type-checking and any future widening of `tsconfig.json`'s `include`).

### Added

- **`bootstrapApp()` returns the `Router` instance** (previously `void`),
  giving consumers direct access to `router.navigate()`, `router.back()`/
  `forward()`, and `router.subscribe()` without a separate router reference.
  Additive change — existing call sites that ignore the return value are
  unaffected. Unblocks `spectre-init` Phase 6 template modernization and
  closes `spectre-shell` Phase 2 (P2.5).
- Added a plugin system: `BootstrapOptions` accepts an optional
  `plugins?: ShellPlugin[]` array. Each plugin's `install(context)` runs after
  `beforeMount` and before `routes()`, in declaration order, receiving a
  `ShellPluginContext` with read access to `bootReady`. Plugin install errors
  propagate through the existing bootstrap error boundary. `ShellPlugin` and
  `ShellPluginContext` are exported from the public API per `PLUGIN_PROPOSAL.md`.
- Added `examples/minimal-spa`, an npm-workspace example app that wires
  `bootstrapApp()` to two lazily loaded routes, observes the `bootReady`
  signal with `effect()`, and imports `spectre-tokens`/`spectre-ui` CSS —
  all resolved through each package's published `dist/` exports rather than
  source. Validates the Phase 2 P0 integration-example deliverable end to end
  (`vite build` against the installed workspace dependency graph).
- Added `@phcdevworks/spectre-manifest` as a devDependency. `spectre.manifest.json`
  at the repo root declares this package's ecosystem role, layer, exports, and
  allowed dependency targets. `check:ecosystem` validates it in the check pipeline.

## [1.1.1] - 2026-06-04

Release Title: Ecosystem Documentation and Release Hygiene

### Added

- Added `PLUGIN_PROPOSAL.md` to document the planned `ShellPlugin` contract,
  execution order, and open implementation decisions for the Phase 2 plugin
  system.

### Changed

- Updated Spectre runtime dependency ranges to the current stable ecosystem
  versions.
- Documented the Spectre ecosystem map in README.md, including the SPA shell
  path and the Astro component path.
- Updated roadmap and TODO status so completed ecosystem documentation is
  reflected consistently across release-planning docs.
- Updated `release:propose` to support patch-level release classifications for
  documentation, config, and dependency-only releases.

## [1.1.0] - 2026-06-01

Release Title: Consumer Smoke Validation and Agent Governance

### Added

- Added `tests/smoke.test.ts` — imports from `dist/index.js` (built output) to
  validate packaging and confirm `bootstrapApp()` runs without error from the
  compiled artifacts. Runs automatically as part of `npm run check`.

### Changed

- Standardized AI role boundaries across agent guidance and added dedicated
  GitHub Copilot repository instructions for support-only usage.

## [1.0.0] - 2026-05-06

Release Title: Stable Bootstrap Lifecycle

### Added

- Added `bootReady` signal (from `@phcdevworks/spectre-shell-signals`) to the public API — `false` initially, set to `true` after a successful bootstrap sequence.
- Added optional `beforeMount` and `afterMount` lifecycle hooks to `BootstrapOptions` — `beforeMount` fires before route registration, `afterMount` fires after router startup and `bootReady` is set.
- Added structured error boundary around the bootstrap sequence — initialization failures now surface as `[spectre-shell] Bootstrap failed: <message>` with the original error preserved as `cause`.
- Wired `@phcdevworks/spectre-shell-signals` as a runtime dependency.

### Changed

- Expanded public API: `index.ts` now exports `bootReady` alongside `bootstrapApp`.

## [0.0.2] - 2026-04-04

Release Title: Package Metadata and CI Hardening

### Changed

- Tightened published package metadata and export hygiene for a clean patch
  release.
- Aligned README and package framing with the current thin-shell contract.
- Tightened agent guidance to match the shell's current ownership boundaries.

### Fixed

- Corrected runtime dependency and stylesheet entrypoint wiring so published
  imports resolve through sibling packages' public surfaces.

### Added

- Added a minimal CI workflow and Dependabot coverage for npm and GitHub
  Actions.
- Added a small Vitest smoke suite covering `bootstrapApp()` orchestration
  order, router handoff, and current error behavior.

## [0.0.1] - 2026-02-10

Release Title: Initial Shell Foundation

### Added

- **Initial Release**: Introduced the thin, framework-agnostic app shell for
  Spectre platform applications.
- **Bootstrap API**: Added the initial bootstrap function for wiring an app
  root to routing and shared styles.
- **Router Integration**: Integrated `@phcdevworks/spectre-shell-router` for
  client-side routing handoff.
- **Style Integration**: Integrated `@phcdevworks/spectre-ui` and Spectre
  design-token styles through the shell entrypoint.
- **TypeScript Build**: Added strict TypeScript configuration and ESM package
  exports.
- **Repository Baseline**: Added MIT license, README, VS Code workspace, and
  initial project metadata.

### Changed

- **Documentation**: Updated README documentation for the shell package and
  naming.
- **Project Identity**: Renamed the package to `spectre-shell` across project
  documentation.

### Fixed

- **Dependabot**: Corrected Dependabot configuration indentation and quoting.
- **Repository Policy**: Updated documentation and security-policy wording.

[unreleased]: https://github.com/phcdevworks/spectre-shell/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/phcdevworks/spectre-shell/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/phcdevworks/spectre-shell/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/phcdevworks/spectre-shell/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/phcdevworks/spectre-shell/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/phcdevworks/spectre-shell/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/phcdevworks/spectre-shell/compare/v0.0.2...v1.0.0
[0.0.2]: https://github.com/phcdevworks/spectre-shell/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/phcdevworks/spectre-shell/tree/v0.0.1
