# Spectre Shell Execution Todo

Tracks forward work from the v1.1.1 release-prep baseline. Phase 1 is
complete. Phase 2 is in progress.

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

## Phase 2: Ecosystem Integration

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

- [ ] Implement `plugins?: ShellPlugin[]` on `BootstrapOptions`
  - Define `ShellPlugin` interface in `src/types.ts` (or inline in
    `bootstrap.ts` if trivial)
  - Execute plugins after `beforeMount`, before `Router` construction
  - Plugin errors must propagate into the existing error boundary
  - Cover invocation order and error propagation in tests
  - Add CHANGELOG entry: minor release

### P2: Ecosystem Documentation

- [x] Add Ecosystem section to README.md
  - Table mapping all Spectre packages to their roles (see shell-signals README
    for the established pattern)
  - Note the two deployment paths: SPA (shell-based) vs Astro (ui-astro)
  - Cross-link package repositories

### P3: Router Signal Bridge — Evaluate

- [ ] Determine whether a `currentRoute` signal belongs in shell, router, or a
  separate utility
  - Read what `spectre-shell-router` currently exposes in its public API
  - Confirm whether this is a shell concern or a router concern before writing
    any code
  - Only implement if the use case is concrete — do not speculate

---

## Phase 3: Later

- [ ] Starter template or `create-spectre-app` scaffolding — depends on Phase 2
  P0 (Integration Example) being validated and stable
- [ ] Framework adapter evaluation — only if a downstream app requires it

## Explicitly Out of Scope

- Do not add routing internals here.
- Do not add reactive primitives here.
- Do not add token or styling definitions here.
- Do not expand `bootstrapApp` into a general application framework.
