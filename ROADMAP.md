# Spectre Shell Roadmap

`@phcdevworks/spectre-shell` is the thin SPA bootstrap layer for the Spectre
system. It wires a root DOM element to route definitions, starts the router,
loads shared shell styles, and exposes a `bootReady` readiness signal.

The foundation is complete at v1.1.1. Phase 2 (P2.1–P2.5) is fully done and
queued for the next release. Phase 3 (broader adoption) is now open.

## Phase 1: Foundation — Complete (v0.0.1 – v1.1.0)

All Phase 1 deliverables shipped. See CHANGELOG.md for details.

- Bootstrap error boundary, lifecycle hooks, `bootReady` signal — v1.0.0
- CI pipeline on Node 22 and 24 — v0.0.2
- Consumer smoke validation against built output — v1.1.0
- SSR stance documented — browser-only, not planned — v1.1.0
- Plugin system evaluated and proposal written — v1.1.0

## Phase 2: Ecosystem Integration

The Spectre package stack is now stable across all five packages
(`spectre-shell`, `spectre-shell-router`, `spectre-shell-signals`,
`spectre-tokens`, `spectre-ui`). Phase 2 is about wiring them into real SPA
applications and making that story clear for downstream consumers.

### P2.1 Integration Example

Status: Done

A minimal SPA that exercises all five Spectre packages together: shell,
router, signals, tokens, and ui. This validates end-to-end assembly from
`bootstrapApp()` through styled output, and serves as the canonical reference
pattern for any downstream app.

Delivered as `examples/minimal-spa`, an npm-workspace member built with Vite:

- `bootstrapApp()` wired to two routes (`/`, `/about`) with lazy `loader()`
  functions
- `bootReady` observed via `effect()` from `spectre-shell-signals`
- `spectre-tokens`/`spectre-ui` CSS imported from each package's published
  `index.css` export
- `vite build` resolves `@phcdevworks/spectre-shell` and its ecosystem
  dependencies through their published `package.json` exports → `dist/`,
  validating the real install path rather than source

### P2.2 Plugin System Implementation

Status: Done (in `[Unreleased]`, queued for next minor release)

`plugins?: ShellPlugin[]` implemented on `BootstrapOptions`. `ShellPlugin` and
`ShellPluginContext` exported from the public API. Plugin execution order,
invocation, and error boundary propagation covered in tests.

### P2.3 Ecosystem Documentation

Status: Complete in v1.1.1

The README now maps the Spectre packages and their
roles. Consumers discovering the shell through `spectre-ui-astro` or
`spectre-tokens` have a clear map of how everything fits together.

Deliverables:

- Ecosystem table in README.md (aligned with the pattern in shell-signals and
  shell-router READMEs)
- Clear distinction between the SPA path (shell-based) and the Astro path
  (ui-astro)
- Cross-links to package repositories

### P2.4 Router Signal Bridge

Status: Decided — app-layer. Phase 2 closed on this item.

`spectre-shell-router` exposes `router.subscribe()`, `onNavigationStart`, and
`onNavigationEnd`. Consuming apps wire `currentRoute` and `navigating` signals
directly using `spectre-shell-signals` at the app layer. The shell does not
export these signals — it stays thin. Revisit only if two or more independent
apps repeat the same wiring pattern.

### P2.5 Programmatic Navigation

Status: Done, in `[Unreleased]`, queued for next minor release.

`bootstrapApp` now returns the `Router` instance created from `options.routes()`
instead of `void` (Option A). Additive change — no existing call sites break;
gives consumers full router access (`navigate`, `replace`, `back`, `forward`,
`subscribe`). Covered in `tests/bootstrap.test.ts`; documented in `README.md`.

**Unblocked by this shipping:**

- `spectre-init` Phase 6 template modernization (navigate() in templates)
- `spectre-shell` Phase 3 (Phase 2 is now fully closed)

## Phase 3: Broader Adoption

Phase 2 is fully closed (P2.4 decided ✓, P2.5 implemented ✓). Phase 3 is open.

### P3.1 Starter Template

A reusable starter repo or `create-spectre-app` scaffolding that pre-wires
the full SPA stack. Depends on P2.1 validated and stable and P2.5 shipped.

### P3.2 Framework Adapter Consideration

The shell is browser-only vanilla TypeScript. Evaluate whether a thin adapter
(e.g. `@phcdevworks/spectre-shell-vue`) belongs in the ecosystem. Triggered
only when a downstream app requires a framework-specific bootstrap entry point.

## Explicitly Out of Scope

- Routing internals — belong in `@phcdevworks/spectre-shell-router`
- Reactive primitives — belong in `@phcdevworks/spectre-shell-signals`
- Token and style definitions — belong in `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
- Astro component rendering — belongs in `@phcdevworks/spectre-ui-astro`
- Full application framework — this package handles startup orchestration only
