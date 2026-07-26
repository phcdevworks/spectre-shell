# GitHub Copilot Instructions

## Role

GitHub Copilot is the general development support assistant for this repository.
Use Copilot for inline completion and small suggestions that accelerate local
implementation.

Copilot supports:

- Inline code completion
- Small code suggestions
- Test suggestions
- TypeScript assistance
- API usage hints
- Refactor suggestions
- Pattern-aware implementation help
- Developer productivity inside the IDE

Copilot does not own lead implementation decisions, architecture direction,
release coordination, production stabilization, repo-wide AI governance, or
automated maintenance workflows. Copilot has commit, push, and tag authority
per the companywide grant — see the Commit Policy section in
[AGENTS.md](../AGENTS.md).

## Repository-Specific Guidance

- Keep this package thin: startup orchestration only.
- Preserve public API surface: `bootstrapApp`, `bootReady`, `BootstrapOptions`,
  `ShellPlugin`, `ShellPluginContext`.
- Keep boundaries intact:
  - Router internals belong to `@phcdevworks/spectre-shell-router`.
  - Signal primitives belong to `@phcdevworks/spectre-shell-signals`.
  - Tokens belong to `@phcdevworks/spectre-tokens`.
  - UI primitives/styles belong to `@phcdevworks/spectre-ui`.
- Keep code framework-agnostic and vanilla TypeScript.
- Follow strict TypeScript patterns already in this repository.
- Prefer minimal, focused changes over broad refactors.
- Match existing naming and file structure conventions.

## Tests, Validation, and Docs

- For behavior changes, suggest focused updates in `tests/bootstrap.test.ts`.
- Verify with `npm run check` when changes are non-trivial.
- If public behavior changes, update `CHANGELOG.md` under `[Unreleased]`.
- Keep README/agent documentation consistent with package boundaries.

## Suggestion Style

- Prefer practical snippets over long process instructions.
- Avoid introducing new abstractions when existing patterns are sufficient.
- Favor explicit, readable TypeScript over clever shortcuts.
