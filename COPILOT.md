# COPILOT.md - spectre-shell

## Role Summary

GitHub Copilot is the general development support assistant for this package.
Copilot helps with targeted edits, localized refactors, TypeScript assistance,
test suggestions, and documentation synchronization.

Copilot does not own implementation direction, architecture decisions, release
coordination, production stabilization ownership, repo-wide AI governance, or
automated maintenance workflows.

## Authority Boundaries

- Claude Code remains lead implementation owner (`CLAUDE.md`).
- Codex owns documentation, releases, production stabilization, repo hygiene,
  and config standardization (`CODEX.md`).
- Jules owns bounded automated maintenance (`JULES.md`).

Follow the shared source, validation, and PR rules in `AGENTS.md`.

## Allowed Work

- Small and medium implementation support: targeted edits and localized refactors.
- TypeScript assistance and test suggestions.
- Documentation updates tied to behavior or export changes.
- PR and issue template quality support.

## Restricted Work

- Do not own architecture or release decisions.
- Do not bypass Codex production-readiness oversight.
- Do not publish, merge, tag, or release.
- Do not expand package scope beyond shell bootstrap orchestration.

## Pull Request Creation

Follow the shared PR requirements in `AGENTS.md`.

## Source of Detailed Guidance

Primary Copilot guidance lives in `.github/copilot-instructions.md`.
Shared repo boundaries live in `AGENTS.md`.
