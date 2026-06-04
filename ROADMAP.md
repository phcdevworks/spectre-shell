# Spectre Shell Roadmap

`@phcdevworks/spectre-shell` is the thin SPA bootstrap layer for the Spectre
system. It wires a root DOM element to route definitions, starts the router,
loads shared shell styles, and exposes a `bootReady` readiness signal.

The foundation is complete at v1.1.0. Phase 2 focuses on wiring the
full Spectre stack into usable SPA applications and making the integration
story clear to downstream consumers.

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

Status: Next

A minimal SPA that exercises all five Spectre packages together: shell,
router, signals, tokens, and ui. This validates end-to-end assembly from
`bootstrapApp()` through styled output, and serves as the canonical reference
pattern for any downstream app.

Deliverables:

- `examples/` directory with a minimal working SPA entry point
- Shows `bootstrapApp()` + route definitions + `bootReady` signal + token CSS
  all working from the published `dist/` output
- Validates the full install path, not just the source tree

### P2.2 Plugin System Implementation

Status: Ready to implement

`PLUGIN_PROPOSAL.md` defines the `ShellPlugin` interface and a `plugins` array
on `BootstrapOptions`. The deferral trigger was "a second downstream consumer
or a concrete use case." With `spectre-ui-astro` at v2.5.0 and the full
ecosystem stable at production versions, that trigger has been met.

Deliverables:

- `plugins?: ShellPlugin[]` on `BootstrapOptions`
- Plugin execution order: after `beforeMount`, before `Router` construction
- Tests covering plugin invocation order and error propagation into the error
  boundary
- CHANGELOG classification: minor

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

Status: Evaluate

The router does not expose navigation state as a reactive signal. The shell is
the natural integration point to bridge `spectre-shell-router` navigation
events into `spectre-shell-signals` reactive state — for example, a
`currentRoute` signal that downstream page code can subscribe to.

This is a net-new capability that touches the router contract. Evaluate whether
this belongs in the shell layer, in the router itself, or as a standalone
utility. Do not implement without confirming the contract with
`spectre-shell-router`.

## Phase 3: Broader Adoption

### P3.1 Starter Template

A reusable starter repo or `create-spectre-app` scaffolding that pre-wires
the full SPA stack. Depends on P2.1 being validated and stable.

### P3.2 Framework Adapter Consideration

The shell is currently browser-only vanilla TypeScript. Evaluate whether a
thin adapter such as `@phcdevworks/spectre-shell-vue` belongs in the ecosystem.
Triggered only when a downstream app requires a framework-specific bootstrap
entry point.

## Explicitly Out of Scope

- Routing internals — belong in `@phcdevworks/spectre-shell-router`
- Reactive primitives — belong in `@phcdevworks/spectre-shell-signals`
- Token and style definitions — belong in `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
- Astro component rendering — belongs in `@phcdevworks/spectre-ui-astro`
- Full application framework — this package handles startup orchestration only
