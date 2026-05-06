# Spectre Shell Execution Todo

This todo list is aligned to the current repository and the roadmap in
`ROADMAP.md`. It is intentionally scoped to bootstrap reliability, lifecycle
hooks, signals integration, and CI.

## P0: Stability / Must-Do — Completed in v1.0.0

- [x] Error boundary around bootstrap sequence — `bootstrapApp()` throws
  `[spectre-shell] Bootstrap failed: <message>` with original error as `cause`.
  Tests cover failure paths and error structure.

- [x] Wire `@phcdevworks/spectre-shell-signals` into bootstrap — `bootReady`
  signal exported from public API; set to `true` after successful bootstrap.
  Integration tests confirm signal state.

- [x] Lifecycle hooks (`beforeMount`, `afterMount`) — optional callbacks on
  `BootstrapOptions`; tests confirm invocation order.

- [x] GitHub Actions CI pipeline — runs `npm run check` on push to main and PR.
  Badge added to README.

## P1: Consumer Clarity and DX

- Add consumer smoke validation File targets:
  - fixture directory or test
  - `package.json` check commands Acceptance criteria:
  - Built package installs cleanly in a downstream fixture
  - `bootstrapApp()` runs without error from the installed package

- Improve README with bootstrap sequence documentation File targets:
  - `README.md` Acceptance criteria:
  - Bootstrap sequence is described clearly (order of operations)
  - `ROADMAP.md` and `TODO.md` are linked from README

## P2: Later / Controlled Improvement

- Evaluate plugin or middleware registration system File targets:
  - planning docs Acceptance criteria:
  - Written proposal only; implement when adoption proves the need

- Document SSR stance File targets:
  - `README.md` or `CONTRIBUTING.md` Acceptance criteria:
  - Current SSR support (or lack thereof) is clearly stated

## Explicitly Out of Scope

- Do not add routing logic here
- Do not add reactive primitives here
- Do not add token or styling definitions here
- Do not expand bootstrapApp into a general application framework

## Recommended Execution Order

1. Error boundary
2. Signals integration
3. Lifecycle hooks
4. CI pipeline
5. Smoke validation
6. README sequence docs
7. Plugin system evaluation (only if demand proven)
