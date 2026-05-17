# Spectre Shell Agent Guide

## Primary AI Developer

**Claude Code** (`claude-sonnet-4-6`) is the designated primary AI developer for
this repository, maintained on behalf of Bradley Potts
(brad.potts@coastdigitalgroup.com) at PHCDevworks. All development is driven
through Claude Code operating from `CLAUDE.md` as the authoritative working
guide. Human final review and commit authority rests with Bradley Potts.

Claude Code does not create git commits. Changes are prepared and validated,
then handed off for human review and commit.

## AI Role Boundaries

- **Claude Code**: lead developer and primary implementation owner.
- **OpenAI Codex**: documentation, releases, production stabilization, repo
  hygiene, and configuration standardization.
- **GitHub Copilot**: general in-IDE development support only (inline
  suggestions, TypeScript/API hints, quick refactors, and test suggestions).
- **Google Jules**: automated maintenance for small fixes, dependency updates,
  and micro-updates.

Copilot supports implementation work but does not own architecture direction,
release coordination, production stabilization ownership, repository-wide AI
governance, or maintenance automation workflow ownership.

## Mission

Coordinate thin shell startup for Spectre apps. This package bootstraps
downstream applications by loading shared styles, running route registration,
and handing startup off to the external router.

## Core Rules

1. Keep the shell focused on orchestration, not visual definition.
2. Preserve `bootstrapApp()` as the primary shared startup contract.
3. Coordinate routing setup without taking ownership of router internals.
4. Keep the package framework-agnostic and limited to vanilla TypeScript
   runtime concerns.
5. Do not move token meaning, styling primitives, or app-specific business
   logic into this package.
6. Prefer sensible defaults for shell startup while keeping boundaries explicit.
7. Keep exported contracts small, typed, and stable for downstream apps.

## Working Boundaries

- Design values and semantic meaning belong in
  `@phcdevworks/spectre-tokens`.
- Primitive styling contracts and reusable CSS implementation belong in
  `@phcdevworks/spectre-ui`.
- Router internals such as path matching, navigation behavior, and lifecycle
  sequencing belong in `@phcdevworks/spectre-shell-router` when routing is
  externalized there.
- Shell responsibilities belong here: bootstrap flow, root mounting, shared
  style initialization, route registration, and router startup coordination.
- App-specific state, feature logic, and domain behavior belong in downstream
  applications.

## Validation Flow

1. Update shell orchestration code, package docs, or package metadata as needed.
2. Confirm the README and agent guidance still describe the same ownership
   boundaries.
3. Run `npm run check`.

## Claude Code Guidance

Read [`CLAUDE.md`](CLAUDE.md) for all operating instructions, commands,
architecture, development rules, and conventions. That file is the authoritative
working guide for Claude Code in this repository.

## Codex Release Agent Guidance

Codex supports Claude Code as the release-readiness reviewer and production
gatekeeper. Codex should read `CODEX.md` after `CLAUDE.md` and this file, then
check implementation, validation, changelog, roadmap, TODO, package metadata,
and documentation consistency before release handoff.

## GitHub Copilot Guidance

Copilot guidance lives in `.github/copilot-instructions.md` and should stay
short, practical, and support-focused. Keep Copilot prompts and completions
aligned to this package's thin-shell boundaries and TypeScript/test standards
without redefining lead ownership already established for Claude Code and
Codex.

## Jules Guidance

Jules should be used for narrowly scoped automated maintenance only (micro-fix
PRs, dependency updates, small repo hygiene tasks). Do not use Jules to set
architecture, own implementation direction, or coordinate releases.
