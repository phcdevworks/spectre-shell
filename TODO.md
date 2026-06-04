# Spectre Shell Execution Todo

Tracks forward work from the v1.1.1 release-prep baseline. Phase 1 is
complete. Phase 2 is in progress.

## Phase 1: Foundation — Complete

All items shipped across v0.0.2 through v1.1.0. See CHANGELOG.md.

---

## Phase 2: Ecosystem Integration

### P2.1 Integration Example

- [ ] Create `examples/` directory with a minimal working SPA
  - Wire `bootstrapApp()` with at least two routes using lazy loaders
  - Import and apply `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
    CSS from the published `dist/` paths (not source)
  - Use `bootReady` signal to confirm startup state
  - Confirm end-to-end install path works as a real consumer, not just source

### P2.2 Plugin System

- [ ] Implement `plugins?: ShellPlugin[]` on `BootstrapOptions`
  - Define `ShellPlugin` interface in `src/types.ts` (or inline in
    `bootstrap.ts` if trivial)
  - Execute plugins after `beforeMount`, before `Router` construction
  - Plugin errors must propagate into the existing error boundary
  - Cover invocation order and error propagation in tests
  - Add CHANGELOG entry: minor release

### P2.3 Ecosystem Documentation

- [x] Add Ecosystem section to README.md
  - Table mapping all Spectre packages to their roles (see shell-signals README
    for the established pattern)
  - Note the two deployment paths: SPA (shell-based) vs Astro (ui-astro)
  - Cross-link package repositories

### P2.4 Router Signal Bridge — Evaluate

- [ ] Determine whether a `currentRoute` signal belongs in shell, router, or a
  separate utility
  - Read what `spectre-shell-router` currently exposes in its public API
  - Confirm whether this is a shell concern or a router concern before writing
    any code
  - Only implement if the use case is concrete — do not speculate

---

## Phase 3: Later

- [ ] Starter template or `create-spectre-app` scaffolding — depends on P2.1
  being validated and stable
- [ ] Framework adapter evaluation — only if a downstream app requires it

## Explicitly Out of Scope

- Do not add routing internals here.
- Do not add reactive primitives here.
- Do not add token or styling definitions here.
- Do not expand `bootstrapApp` into a general application framework.
