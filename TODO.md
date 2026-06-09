# Spectre Shell Execution Todo

Tracks forward work from the v1.1.1 baseline. Phase 1 is complete. Phase 2
core (P0/P1/P2) is complete and queued for the next release. P3 Router Signal
Bridge is the current evaluation item. Phase 3 (broader adoption) is next.

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

### P3: Router Signal Bridge — Evaluate

`spectre-shell-router` now exposes `router.subscribe()` (fires with
`RouteContext` after each navigation) and `onNavigationStart`/`onNavigationEnd`
hooks. The question is where `currentRoute` and `navigating` signals live.

- [ ] Decide: does `spectre-shell` own a `currentRoute` signal and a
  `navigating` signal, or does the consuming app wire these at the app layer?
  - Shell case: shell creates the Router internally, so it could expose these
    as exported signals wrapping `router.subscribe()` and the nav hooks.
  - App-layer case: consuming apps wire signals directly against the Router
    using the signals package — no shell change needed.
  - **Lean toward app-layer**: keeps the shell thin and avoids coupling it
    to the router's API shape. Only move to shell if multiple apps repeat
    the same wiring.
  - Only implement if use case is concrete — do not speculate.

---

## Phase 3: Broader Adoption

- [ ] **Programmatic navigation** — resolve before starter template ships
  (see spectre-init consumer requirements below)
- [ ] Starter template or `create-spectre-app` scaffolding — depends on Phase 2
  P0 validated and stable, and programmatic navigation resolved
- [ ] Framework adapter evaluation — only if a downstream app requires it

---

## spectre-init Consumer Requirements

`@phcdevworks/spectre-init` scaffolds templates against this package. These items
are needed for templates to work correctly and demonstrate the full API surface.

### P0: Programmatic Navigation — Blocking spectre-init Phase 3

`bootstrapApp` creates the `Router` internally and returns `void`. Templates have
no way to call `router.navigate()` programmatically. The current workaround is
`<a href="...">` links (Router click interception), but buttons that navigate
programmatically are a basic app pattern.

**Decision required** — choose one and implement:

- [ ] **Option A** — `bootstrapApp` returns the `Router` instance
  (minor release; currently `void` — additive, no existing callers break)
- [ ] **Option B** — export a module-level `navigate(path: string)` helper
  that proxies to the last-created Router (no signature change)

**Recommendation**: Option A. Returning the Router is the cleaner contract and
gives consumers full access (navigate, replace, back, forward) without a
module-level proxy. The `void` return was a default, not a promise.

Do not leave this to `history.pushState` — it bypasses the Router's
race-condition guard.

### P1: Template Showcase Items — Needed before spectre-init Phase 3 ships

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
