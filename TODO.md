# Spectre Shell Execution Todo

This todo list is aligned to the current repository and the roadmap in
`ROADMAP.md`. It is intentionally scoped to bootstrap reliability, lifecycle
hooks, signals integration, consumer validation, and CI.

## Phase 1 - Foundation: Completed

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

---

## Phase 2 - Mature Operations

All items below are forward-looking. This phase starts from the stable v1.0.0
foundation and focuses on real downstream consumption, controlled improvement,
and documented stances.

### P1: Consumer Smoke Validation

- [x] Add consumer smoke validation
  - Added `tests/smoke.test.ts` importing from `dist/index.js` (built output).
  - Verifies `bootstrapApp` and `bootReady` are exported and that
    `bootstrapApp()` runs without error from the compiled artifacts.
  - Runs as part of `npm run test` (after `build` in the `check` pipeline).

### P2: Controlled Improvement

- [ ] Evaluate plugin or middleware registration system
  - File targets: planning docs only.
  - Acceptance criteria: written proposal; implement only when adoption proves
    the need.
  - Risk if skipped: not a risk at current scale; revisit when demand is proven.

- [x] Document SSR stance
  - Added "Server-Side Rendering" section to `README.md` stating the package
    does not support SSR, why, and the condition for revisiting.

## Recommended Execution Order

1. Consumer smoke validation against the real install path.
2. Plugin system evaluation only when adoption proves the need.
3. SSR stance documentation when a concrete use case demands it.

## Explicitly Out of Scope

- Do not add routing logic here.
- Do not add reactive primitives here.
- Do not add token or styling definitions here.
- Do not expand `bootstrapApp` into a general application framework.
