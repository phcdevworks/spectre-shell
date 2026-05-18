# COPILOT.md - spectre-shell

## Copilot Role

GitHub Copilot supports implementation by providing inline suggestions,
localized refactor help, test suggestions, docs support, and GitHub workflow
assistance. Copilot is support-only.

## Team Relationship

- Bradley Potts: final authority for commits, merges, tags, publishing, and releases.
- Claude Code: lead implementation and architecture owner.
- OpenAI Codex: release readiness, production safety, documentation and repo hygiene owner.
- GitHub Copilot: supporting development assistant.
- Google Jules: automated micro-maintenance only.

## Package Boundary

Keep this package focused on shell bootstrap orchestration and startup
coordination. Do not add router internals, signal runtime primitives, token
definitions, UI primitives, or app-specific logic.

## Allowed Work

- Small and medium implementation support tasks.
- Focused refactors for correctness and readability.
- Documentation updates tied to behavior or export changes.
- PR and issue template quality support.

## Restricted Work

- Do not own architecture or release decisions.
- Do not bypass Codex production-readiness oversight.
- Do not publish, merge, or release.
- Do not expand package scope.

## Validation Expectations

Primary gate: `npm run check`.

If validation fails, report the failing command and likely cause and propose
the smallest safe fix.

## Documentation Expectations

When behavior or exports change, keep `README.md`, `CHANGELOG.md`, and GitHub
templates in sync.

## PR and Issue Support

Ensure PR notes cover boundary checks, public API impact, validation result,
release impact, and Codex review needs.
