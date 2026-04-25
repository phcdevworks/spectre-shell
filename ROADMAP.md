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

- No lifecycle hooks for pre- and post-bootstrap phases.
- No error boundary around the bootstrap sequence — failures are silent.
- Integration with `@phcdevworks/spectre-shell-signals` is not yet wired.
- No CI pipeline for automated build and test validation.
- Only a single export (`bootstrapApp`) with no route-level or plugin
  extensibility.

### Missing policy, docs, or tests that would improve reliability

- Integration test coverage for the full bootstrap sequence
- Error recovery documentation and behavior
- Consumer smoke validation (does the package actually install and run cleanly
  in a downstream project?)

## 2. Roadmap

## P0: Stability / Must-Do

### P0.1 Bootstrap Error Boundary

Objective Add structured error handling around the bootstrap sequence so
failures surface clearly rather than silently.

Why it matters A shell that fails silently is worse than one that fails loudly.
Consumers need a clear signal when router or style initialization goes wrong.

Suggested deliverables

- Wrap bootstrap initialization in try/catch with meaningful error output
- Document expected failure modes in `README.md`
- Add tests for bootstrap failure paths

Dependency notes

- No dependencies; can be done immediately

Risk if skipped

- Bootstrap failures are invisible to developers until runtime

### P0.2 Signals Integration

Objective Wire `@phcdevworks/spectre-shell-signals` into the bootstrap layer so
reactive state is available from startup.

Why it matters The shell, router, and signals packages form a cohesive runtime
foundation. The shell should coordinate their initialization order.

Suggested deliverables

- Import and initialize signals alongside router in `bootstrapApp()`
- Document initialization order in `README.md`
- Add integration tests confirming signals are ready after bootstrap

Dependency notes

- Depends on `@phcdevworks/spectre-shell-signals` being stable

Risk if skipped

- Consumers must wire signals manually, increasing integration complexity

### P0.3 Pre- and Post-Bootstrap Lifecycle Hooks

Objective Expose optional lifecycle hook points around the bootstrap sequence.

Why it matters Applications often need to run setup logic before the router
starts (auth checks, config loading) or after it starts (analytics init, feature
flags). The shell should support this without requiring a fork.

Suggested deliverables

- Add optional `beforeMount` and `afterMount` callbacks to `bootstrapApp()`
- Keep hooks synchronous unless async is proven necessary
- Add tests for hook invocation order

Dependency notes

- Depends on the error boundary being in place first

Risk if skipped

- Consumers work around missing hooks with fragile timing hacks

### P0.4 CI Pipeline

Objective Add a CI pipeline that runs build, lint, and tests on every push.

Why it matters Without CI, regressions can ship unnoticed. The shell is a shared
dependency across all Spectre applications.

Suggested deliverables

- GitHub Actions workflow running `npm run check` on push and PR
- Badge in `README.md`

Dependency notes

- No blocking dependencies

Risk if skipped

- Regressions ship without automated catch

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

1. Add bootstrap error boundary
2. Wire signals integration
3. Add lifecycle hooks
4. Add CI pipeline
5. Add consumer smoke validation
6. Improve README sequence documentation
7. Evaluate plugin system only if adoption demands it
