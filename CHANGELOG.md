# Changelog

All notable changes to this project will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning reflects package releases.

## [Unreleased]

## [1.0.0] - 2026-05-06

### Added

- Added `bootReady` signal (from `@phcdevworks/spectre-shell-signals`) to the public API — `false` initially, set to `true` after a successful bootstrap sequence.
- Added optional `beforeMount` and `afterMount` lifecycle hooks to `BootstrapOptions` — `beforeMount` fires before route registration, `afterMount` fires after router startup and `bootReady` is set.
- Added structured error boundary around the bootstrap sequence — initialization failures now surface as `[spectre-shell] Bootstrap failed: <message>` with the original error preserved as `cause`.
- Wired `@phcdevworks/spectre-shell-signals` as a runtime dependency.

### Changed

- Expanded public API: `index.ts` now exports `bootReady` alongside `bootstrapApp`.

## [0.0.2] - 2026-04-04

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

### Added

- Initial release: Thin, framework-agnostic app shell for Spectre platform ([d1eadf2]).
- Bootstrap function for initializing apps with routing and styling ([d1eadf2]).
- Integration with `@phcdevworks/spectre-shell-router` for client-side routing ([d1eadf2]).
- Integration with `@phcdevworks/spectre-ui` for styling framework ([d1eadf2]).
- Auto-import of Spectre design tokens and UI styles ([d1eadf2]).
- TypeScript configuration with strict type checking ([d1eadf2]).
- Package exports configuration for ES module compatibility ([d1eadf2]).
- Repository boilerplate including MIT license, README, VS Code workspace, and project configuration files ([78e49e9]).

### Changed

- Updated TypeScript config and build setup ([d91d07d]).
- Updated README documentation for spectre-shell package ([6298251]).
- Renamed project to spectre-shell and updated all documentation ([630ec4a]).

### Fixed

- Fixed dependabot.yml indentation and quoting ([27169d4]).
- Updated docs and security policy wording ([87b16c2]).

[unreleased]: https://github.com/phcdevworks/spectre-shell/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/phcdevworks/spectre-shell/compare/v0.0.2...v1.0.0
[0.0.2]: https://github.com/phcdevworks/spectre-shell/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/phcdevworks/spectre-shell/tree/v0.0.1
[d91d07d]: https://github.com/phcdevworks/spectre-shell/commit/d91d07d
[630ec4a]: https://github.com/phcdevworks/spectre-shell/commit/630ec4a
[6298251]: https://github.com/phcdevworks/spectre-shell/commit/6298251
[d1eadf2]: https://github.com/phcdevworks/spectre-shell/commit/d1eadf2
[27169d4]: https://github.com/phcdevworks/spectre-shell/commit/27169d4
[87b16c2]: https://github.com/phcdevworks/spectre-shell/commit/87b16c2
[78e49e9]: https://github.com/phcdevworks/spectre-shell/commit/78e49e9
