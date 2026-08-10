# Spectre Shell Roadmap

`@phcdevworks/spectre-shell` is the thin SPA bootstrap layer for the Spectre
system. It wires a root DOM element to route definitions, starts the router,
loads shared shell styles, and exposes a `bootReady` readiness signal.

This document tracks what's next. For what already shipped and why, see
[CHANGELOG.md](CHANGELOG.md) (release-by-release detail) and git history —
this file does not restate delivered work.

---

## Delivered Phases

| Phase | Summary | Shipped in |
| --- | --- | --- |
| 1 | Foundation — bootstrap error boundary, lifecycle hooks (`beforeMount`/`afterMount`), `bootReady` signal, CI on Node 22/24, consumer smoke validation, SSR stance documented, plugin proposal written | 0.0.1–1.1.1 |
| 2 | Ecosystem integration — `examples/minimal-spa` end-to-end integration example, `ShellPlugin` plugin system, ecosystem docs in README, router-signal bridge decided (app-layer), `bootstrapApp` returns `Router` (programmatic navigation) | 1.1.1–1.3.0 |
| 3 | TypeScript 7 compatibility — native TS7 compiler for build/typecheck, TS6 compatibility alias retained for `typescript-eslint`, dependency baselines bumped across the ecosystem | 1.3.0 |

---

## What's Next

No active phase is currently open. Phase 2 fully closed the router-signal
bridge decision (app-layer) and programmatic navigation, unblocking
`spectre-init` Phase 6 template modernization. Candidate future work —
a starter template / `create-spectre-app` scaffolding, or a framework adapter
(e.g. `@phcdevworks/spectre-shell-vue`) — stays deferred until a downstream
consumer surfaces a concrete requirement. See [TODO.md](TODO.md).

---

## Explicitly Out of Scope

- Routing internals — belong in `@phcdevworks/spectre-shell-router`
- Reactive primitives — belong in `@phcdevworks/spectre-shell-signals`
- Token and style definitions — belong in `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
- Astro component rendering — belongs in `@phcdevworks/spectre-ui-astro`
- Full application framework — this package handles startup orchestration only
