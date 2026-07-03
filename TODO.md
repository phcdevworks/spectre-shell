# Spectre Shell Execution Todo

Tracks forward work from the v1.1.1 baseline. Phase 1 is complete. Phase 2
(P0–P2.5) is fully complete and queued for the next release. Phase 3
(broader adoption) is now open.

## Phase 1: Foundation — Complete

All Phase 1 items were delivered in the v0.0.2 through v1.0.0 release cycle.

### P0: Stability

- [x] Error boundary around bootstrap sequence -- `bootstrapApp()` throws
  `[spectre-shell] Bootstrap failed: <message>` with original error as `cause`.
  Tests cover failure paths and error structure.

- [x] Wire `@phcdevworks/spectre-shell-signals` into bootstrap -- `bootReady`
  signal exported from public API; set to `true` after successful bootstrap.
  Integration tests confirm signal state.

- [x] Lifecycle hooks (`beforeMount`, `afterMount`) -- optional callbacks on
  `BootstrapOptions`; tests confirm invocation order.

- [x] GitHub Actions CI pipeline -- runs `npm run check` on push to main and PR.
  Badge added to README.

### P1: Consumer Clarity

- [x] Improve README with bootstrap sequence documentation -- Added ordered
  `beforeMount -> routes -> Router -> bootReady -> afterMount` sequence. CI
  badge and ROADMAP link added to README.

### P1: Consumer Smoke Validation

- [x] Add consumer smoke validation
  - Added `tests/smoke.test.ts` importing from `dist/index.js` (built output).
  - Verifies `bootstrapApp` and `bootReady` are exported and that
    `bootstrapApp()` runs without error from the compiled artifacts.
  - Runs as part of `npm run test` (after `build` in the `check` pipeline).

### P2: Controlled Improvement

- [x] Evaluate plugin or middleware registration system
  - Written proposal in `PLUGIN_PROPOSAL.md` — defines `ShellPlugin` interface,
    proposed `plugins` array on `BootstrapOptions`, execution order, and the
    adoption trigger for implementation.
  - Deferred until a second consumer or concrete use case demands it.

- [x] Document SSR stance
  - Added "Server-Side Rendering" section to `README.md` stating the package
    does not support SSR, why, and the condition for revisiting.

All items above shipped across v0.0.2 through v1.1.0. See CHANGELOG.md.

---

## Phase 2: Ecosystem Integration — Core Complete (P0/P1/P2 done; P3 evaluate)

P0 integration example, P1 plugin system, and P2 ecosystem docs are all done
and in `[Unreleased]`. Ready to release as a minor version once P3 is resolved
or deferred explicitly.

### P0: Integration Example

- [x] Create `examples/` directory with a minimal working SPA
  - Added `examples/minimal-spa` as an npm workspace member (Vite-driven)
  - `bootstrapApp()` wired with two routes (`/`, `/about`) using lazy `loader()`
    functions
  - Imports `@phcdevworks/spectre-tokens/index.css` and
    `@phcdevworks/spectre-ui/index.css` — resolved through each package's
    published `exports`/`dist`, not source
  - Observes `bootReady` via `effect()` from `@phcdevworks/spectre-shell-signals`
    to confirm startup state
  - `vite build` resolves and bundles `@phcdevworks/spectre-shell` through its
    published `package.json` exports → `dist/index.js`, validating the real
    install path end to end

### P1: Plugin System

- [x] Implement `plugins?: ShellPlugin[]` on `BootstrapOptions`
  - `ShellPlugin`/`ShellPluginContext` defined in `src/bootstrap.ts` and
    exported from the public API per `PLUGIN_PROPOSAL.md`
  - Plugins install after `beforeMount`, before `routes()`, in declaration
    order, with read access to `bootReady` via the context
  - Plugin install errors propagate into the existing error boundary
  - Invocation order and error propagation covered in `tests/bootstrap.test.ts`
  - CHANGELOG entry added under `[Unreleased]` (minor release)

### P2: Ecosystem Documentation

- [x] Add Ecosystem section to README.md
  - Table mapping all Spectre packages to their roles (see shell-signals README
    for the established pattern)
  - Note the two deployment paths: SPA (shell-based) vs Astro (ui-astro)
  - Cross-link package repositories

### P3: Router Signal Bridge — Decided ✓

- [x] **Decision: app-layer.** Consuming apps wire `currentRoute` and `navigating`
  signals directly against the Router using `spectre-shell-signals`. The shell does
  not export these signals — it stays thin. Revisit only if two or more independent
  apps repeat the same wiring pattern. Phase 2 is closed on this item.

---

## Phase 2: Ecosystem Integration — Complete (P0–P2.5)

Phase 2 is fully closed. Phase 3 is now open.

### P2.5: Programmatic Navigation — Done

`bootstrapApp` creates the `Router` internally and now returns it instead of
`void` (Option A). Additive change; no existing callers break; gives consumers
full router access.

- [x] Change `bootstrapApp` return type from `void` to `Router`
  - Files: `src/bootstrap.ts`, `src/index.ts`, `tests/bootstrap.test.ts`, `README.md`
  - Acceptance: `bootstrapApp(options)` returns the `Router` instance; existing call
    sites that ignore the return value continue to work; tests confirm the instance
    is the same Router used internally; CHANGELOG entry added under `[Unreleased]`

---

## Phase 3: Broader Adoption

Prerequisite met: P2.5 implemented, Phase 2 fully closed.

- [ ] Starter template or `create-spectre-app` scaffolding — depends on Phase 2 closed and stable
- [ ] Framework adapter evaluation — only if a downstream app requires it

---

## spectre-init Consumer Requirements

`@phcdevworks/spectre-init` scaffolds templates against this package. These items
are needed for templates to work correctly and demonstrate the full API surface.
P0 (programmatic navigation) is done; P1 items remain before spectre-init Phase 6 ships.

### P1: Template Showcase Items — Needed before spectre-init Phase 6 ships (P0 done)

These APIs are shipped in v1.1.1 but not yet in scaffolded output. Confirm they
are stable and documented so spectre-init templates can reference them.

- [ ] Confirm `beforeMount` / `afterMount` usage example in README or examples/
- [ ] Confirm `plugins: ShellPlugin[]` usage example in README or examples/
- [ ] Confirm `bootReady` observation pattern (via `effect()`) in README or examples/

## Explicitly Out of Scope

- Do not add routing internals here.
- Do not add reactive primitives here.
- Do not add token or styling definitions here.
- Do not expand `bootstrapApp` into a general application framework.
