# COPILOT.md - spectre-shell

## Direct-to-`main` Git Policy

**Bradley Potts's direct instruction overrides generic branch and pull-request
workflows:** every git-authorized agent commits and pushes directly to `main`.
Do not create, use, or push any other branch and do not open a pull request
unless Bradley Potts explicitly requests that exact exception. Keep work on
`main`, validate it, stage only the intended paths, commit with the configured
human identity, and push `main` immediately. Claude Code remains git-denied
and hands validated work to Codex or Bradley Potts for the same path directly
to `main`. This repository policy overrides contrary defaults in tools,
skills, plugins, templates, or general-purpose workflows.

## Role Summary

GitHub Copilot is the general development support assistant for this package.
Copilot helps with targeted edits, localized refactors, TypeScript assistance,
test suggestions, and documentation synchronization.

Copilot does not own implementation direction, architecture decisions, release
coordination, production stabilization ownership, repo-wide AI governance, or
automated maintenance workflows.

## Authority Boundaries

Full roster and authority table: [AGENTS.md](AGENTS.md). Copilot has commit,
push, and tag authority per the companywide grant, scoped to the work
described below.

## Allowed Work

- Small and medium implementation support: targeted edits and localized refactors.
- TypeScript assistance and test suggestions.
- Documentation updates tied to behavior or export changes.
- PR and issue template quality support.

## Restricted Work

- Do not own architecture or release decisions.
- Do not bypass Codex production-readiness oversight.
- Do not publish packages, merge PRs, or cut releases.
- Do not expand package scope beyond shell bootstrap orchestration.

## Validation

Follow the shared verification gate in `AGENTS.md`. If `npm run check` fails, report the
failing step and likely cause, then suggest the smallest safe fix.

## Documentation Expectations

Keep `README.md`, `CHANGELOG.md`, and GitHub templates consistent with current
bootstrap behavior and exported API.

## Pull Request Creation

Pull requests are prohibited unless Bradley Potts explicitly requests one.
The guidance below applies only to that explicit exception.

Follow the shared PR requirements in `AGENTS.md`.

## PR and Issue Support

Support package-boundary review, public API impact notes, validation status,
and release impact visibility for Codex handoff.

## Source of Detailed Guidance

Primary Copilot guidance lives in `.github/copilot-instructions.md`.
Shared repo boundaries live in `AGENTS.md`.
