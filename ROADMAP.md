# Spectre Shell Roadmap

This roadmap is grounded in the current repository shape and public contract of
`@phcdevworks/spectre-shell` as it exists today.

`@phcdevworks/spectre-shell` is the thin application bootstrap layer for the
Spectre system. It owns startup orchestration only — wiring the router, applying
styles, and providing a clean entry point for Spectre-based applications. It
does not own routing logic, reactive state, design tokens, or CSS.

The work below focuses on making the shell trustworthy, complete, and easy to
delete — not on expanding its scope.

## 1. Current Repo Assessment

### Current strengths

- The shell already exports a single `bootstrapApp()` function — API surface is
  intentionally minimal.
- The dependency graph is correct: shell consumes router, tokens, and UI without
  owning any of them.
- TypeScript strict mode is in place.
- The thin-shell principle is documented and enforced as the operating philosophy.
- Consumer smoke validation confirms the built package installs and runs cleanly.
- README documents the full bootstrap sequence with ordered step walk-through.
- SSR stance is documented — package is browser-only by design.

### Remaining gap

- None. Plugin or middleware registration has been evaluated and a proposal
  written (`PLUGIN_PROPOSAL.md`). Implementation is deferred until adoption
  demands it (see P2.1).

## 2. Roadmap

## P0: Stability / Must-Do — Completed in v1.0.0

### P0.1 Bootstrap Error Boundary — Done

Bootstrap sequence is wrapped in a try/catch that throws
`[spectre-shell] Bootstrap failed: <message>` with the original error as `cause`.
Tests cover the failure path and error structure.

### P0.2 Signals Integration — Done

`@phcdevworks/spectre-shell-signals` is wired as a runtime dependency.
`bootReady` is exported from the public API — `false` initially, set to `true`
after a successful bootstrap. Tests confirm the signal state at each phase.

### P0.3 Pre- and Post-Bootstrap Lifecycle Hooks — Done

`beforeMount` and `afterMount` are optional callbacks on `BootstrapOptions`.
`beforeMount` fires before route registration; `afterMount` fires after router
startup and `bootReady` is set. Tests confirm invocation order.

### P0.4 CI Pipeline — Done

GitHub Actions workflow runs `npm run check` on push to main and on every PR.
Badge added to `README.md`.

## P1: Consumer Clarity and DX

### P1.1 Consumer Smoke Validation — Done

Added `tests/smoke.test.ts` importing from `dist/index.js`. Verifies
`bootstrapApp` and `bootReady` are exported and that `bootstrapApp()` runs
without error from the compiled artifacts. Runs as part of `npm run test`
(after `build` in the `check` pipeline).

### P1.2 Improve README with Bootstrap Sequence Diagram — Done

Added an ordered bootstrap sequence to `README.md` describing the
`beforeMount → routes → Router → bootReady → afterMount` flow. CI badge and
links to `ROADMAP.md` added to README header.

## P2: Later / Controlled Improvement

### P2.1 Plugin or Middleware System — Evaluated, Deferred

Written proposal in `PLUGIN_PROPOSAL.md`. Defines a `ShellPlugin` interface, a
`plugins` array on `BootstrapOptions`, execution order within the bootstrap
sequence, and the adoption trigger for implementation. Implementation is deferred
until a second downstream consumer or a concrete use case is filed.

### P2.2 Server-Side Rendering Evaluation — Done

Added "Server-Side Rendering" section to `README.md` stating the package does
not support SSR, the reason, and the condition for revisiting.

## 3. Explicitly Out of Scope

- Do not add routing logic here — that belongs in `@phcdevworks/spectre-shell-router`
- Do not add reactive primitives here — that belongs in `@phcdevworks/spectre-shell-signals`
- Do not add styling or token definitions here
- Do not turn the bootstrap function into a full application framework

## 4. Recommended Execution Order

1. ~~Add bootstrap error boundary~~ Done (v1.0.0)
2. ~~Wire signals integration~~ Done (v1.0.0)
3. ~~Add lifecycle hooks~~ Done (v1.0.0)
4. ~~Add CI pipeline~~ Done (v0.0.2)
5. ~~Add consumer smoke validation~~ Done
6. ~~Improve README sequence documentation~~ Done
7. ~~Evaluate plugin system only if adoption demands it~~ Done — see `PLUGIN_PROPOSAL.md`
