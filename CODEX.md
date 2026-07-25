# CODEX.md - spectre-shell

## Role

Codex is the release, documentation, production stabilization, repo hygiene,
refactor review, and configuration standardization agent for
`@phcdevworks/spectre-shell`.

Full roster and authority table: [AGENTS.md](AGENTS.md). Codex keeps Claude
Code's work production-ready. Human final review, release decisions, tagging,
and publishing remain with Bradley Potts. Codex has commit, push, and tag
authority for its own scope of work — validate changes, then stage, commit,
and push.

## Entry Point

At the start of any Codex session:

1. Read `CLAUDE.md` for development authority and project rules.
2. Read this file for Codex-specific procedures.

---

## Operating Loop

1. Check `git status --short`; identify existing user or Claude changes and
   avoid overwriting them.
2. Review changes against the shell boundary: orchestration belongs here;
   routing internals, tokens, UI primitives, reactive primitives, and app logic
   do not.
3. Refactor only when it reduces release risk, clarifies the public contract, or
   removes real duplication. Keep refactors small and directly tied to the task.
4. Update documentation when behavior, release process, public API, or ownership
   language changes.
5. Keep changelog and release-note support current for user-visible or release
   process changes.
6. Run `npm run check` after non-trivial changes and report the result.

## Pull Request Creation

Follow the shared PR requirements in `AGENTS.md`. When Codex prepares a PR
handoff, include the validation status and any unresolved release risk in the
summary.

## Release Readiness Checklist

- Public API remains limited to `bootstrapApp`, `bootReady`, `BootstrapOptions`,
  `ShellPlugin`, and `ShellPluginContext`, unless Bradley explicitly approves an
  expansion.
- Public behavior changes include a focused test and a `CHANGELOG.md`
  `[Unreleased]` entry.
- `README.md`, `CLAUDE.md`, `AGENTS.md`, `ROADMAP.md`, and `TODO.md` describe
  the same ownership boundaries.
- `package.json` exports, `types`, `sideEffects`, dependencies, and package
  metadata still match the built output and runtime behavior.
- Build output changes in `dist/` are expected, reviewed, and consistent with
  source changes when release artifacts are regenerated.
- No new dependency expands scope or duplicates existing package responsibility.
- `npm run check` passes before release handoff.

## Handoff Format

When reporting release readiness, include:

- Current git status summary.
- Files changed by Codex.
- Validation commands run and whether they passed.
- Any public behavior, package metadata, or documentation changes.
- Remaining risks, blockers, or human review notes.

---

## Git Boundaries

Codex may inspect git status and diffs freely. Codex must not reset, discard,
or overwrite changes it did not make. Existing local edits are assumed to
belong to Bradley Potts, Claude Code, or another active process.

Codex validates changes, then stages, commits, and pushes them within its own
scope of work. Codex does not publish or merge PRs; those stay gated per
"Role" above.

---

## Source of Truth Hierarchy

When guidance conflicts, resolve in this order:

1. `package.json` / `CHANGELOG.md` - actual shipped state
2. `CLAUDE.md` - development authority
3. `AGENTS.md` - shared agent boundaries
4. This file (`CODEX.md`) - Codex operational procedures
5. `ROADMAP.md` / `TODO.md` - forward-looking plans, may be stale
