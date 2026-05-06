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

### Current gaps to harden

- No consumer smoke validation for the full install-and-run path.
- No README sequence diagram for onboarding new consumers.
- No plugin or middleware registration pattern.
- No documented SSR stance.

### Missing policy, docs, or tests that would improve reliability

- Consumer smoke validation (does the package actually install and run cleanly
  in a downstream project?)
- Bootstrap sequence diagram or ordered walk-through in README

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

### P1.1 Consumer Smoke Validation

Objective Validate that the package installs and runs correctly from a downstream
consumer's perspective.

Why it matters Source correctness does not guarantee package correctness. The
shell should validate the real install path.

Suggested deliverables

- Smoke test fixture that installs the built package and calls `bootstrapApp()`
- Include validation in the main check path

Dependency notes

- Best done after bootstrap sequence is stable

Risk if skipped

- Packaging or export issues slip through to consumers

### P1.2 Improve README with Bootstrap Sequence Diagram

Objective Add a clear description of the bootstrap sequence and initialization
order.

Why it matters The shell's value is clarity. Consumers should understand exactly
what happens when `bootstrapApp()` is called.

Suggested deliverables

- Sequence diagram or ordered list in `README.md`
- Link `ROADMAP.md` and `TODO.md` from the README

Dependency notes

- Low dependency

Risk if skipped

- Shell behavior remains opaque to new consumers

## P2: Later / Controlled Improvement

### P2.1 Plugin or Middleware System

Objective Evaluate whether an optional plugin registration pattern is warranted.

Why it matters Some applications may need to extend the shell without forking it.
This is worth evaluating only once the core API is stable.

Suggested deliverables

- Proposal document for plugin interface
- Implement only if adoption proves the need

Dependency notes

- Only after P0 and P1 are complete

Risk if skipped

- Not a risk at current scale; revisit when demand is proven

### P2.2 Server-Side Rendering Evaluation

Objective Evaluate whether `bootstrapApp()` can or should support SSR contexts.

Suggested deliverables

- Document current SSR stance
- Implement only if a clear use case from WordPress or Astro integration demands it

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
5. Add consumer smoke validation
6. Improve README sequence documentation
7. Evaluate plugin system only if adoption demands it
