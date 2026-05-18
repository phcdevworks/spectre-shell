# AGENTS.md - spectre-shell

## AI Operating Model

This is the central AI coordination document for the repository. Agent-specific
files may add tool-local guidance, but they must not override the role
boundaries below.

This repository uses a four-agent AI operating model with defined,
non-overlapping roles:

| Agent              | Role                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| **Claude Code**    | Lead developer - primary implementation, architecture, tests           |
| **OpenAI Codex**   | Documentation, releases, production stabilization, repo hygiene        |
| **GitHub Copilot** | General development assistance (in-editor suggestions)                 |
| **Google Jules**   | Automated maintenance - small fixes, dependency updates, micro-patches |

Human commit and release authority rests with Bradley Potts
(brad.potts@coastdigitalgroup.com). No AI agent creates git commits, pushes
branches, creates tags, merges pull requests, publishes packages, or creates
releases.

## Instruction Map

| File                              | Audience                     | Purpose                                                            |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                       | All agents, especially Codex | Central role model, coordination rules, verification gate          |
| `CLAUDE.md`                       | Claude Code                  | Lead-development guide for implementation, architecture, and tests |
| `CODEX.md`                        | OpenAI Codex                 | Release-readiness, production stabilization, and config posture    |
| `.github/copilot-instructions.md` | GitHub Copilot               | In-editor suggestion boundaries                                    |
| `.claude/settings.json`           | Claude Code runtime          | Local command denies for commit, push, tag, merge, and publish     |
| `.coderabbit.yaml`                | CodeRabbit                   | Automated review checks aligned with package boundaries            |
| `.github/dependabot.yml`          | Dependabot / Jules handoff   | Dependency-update cadence for automated maintenance                |

## Claude Code - Lead Developer

**Claude Code** (`claude-sonnet-4-6`) is the designated primary AI developer for
this repository, maintained on behalf of Bradley Potts
(brad.potts@coastdigitalgroup.com) at PHCDevworks. All development is driven
through Claude Code operating from `CLAUDE.md` as the authoritative working
guide.

**Owns:** shell implementation, shell architecture, tests, and final
implementation validation.

**Does not own:** documentation publishing, release versioning, changelog
authorship, dependency bump PRs, or repo-wide AI governance.

## OpenAI Codex - Documentation & Releases

Codex handles documentation quality, release preparation, production
stabilization, repo hygiene, config standardization, and release-readiness
checks. Codex operates from `AGENTS.md` and `CODEX.md`.

**Owns:** README/changelog/release note support, package metadata review,
production-readiness checks, repo hygiene, config cleanup, PR template hygiene,
and AI-agent instruction alignment.

**Does not own:** primary feature implementation, shell architecture, large
refactors, dependency-update ownership, deployment, publishing, or release
execution.

## GitHub Copilot - Development Assistance

Copilot provides in-editor code suggestions and assists developers during active
coding sessions. See `.github/copilot-instructions.md` for Copilot-specific
guidance.

Copilot does not own lead implementation decisions, architecture direction,
release coordination, production stabilization ownership, repository-wide AI
governance, automated maintenance workflows, config standardization ownership,
or commit authority.

## Google Jules - Automated Maintenance

Jules handles small, automated maintenance tasks that do not require
architectural judgment: dependency version bumps, tiny config corrections, and
mechanical documentation fixes.

Jules does not own feature work, architecture changes, public API changes, large
refactors, release decisions, or publishing.

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

## Coordination Rules

- When instructions conflict, follow this priority: direct human request,
  `AGENTS.md`, agent-specific file, then tool suggestions.
- Claude Code leads any change that alters shell behavior, public TypeScript
  contracts, startup orchestration, tests, or package architecture.
- Codex keeps production readiness in check and leads documentation, release
  notes, release preparation, stabilization review, repo hygiene, and AI/config
  cleanup.
- Copilot output is advisory only; accepted suggestions still follow the owning
  agent or human reviewer.
- Jules and Dependabot changes should stay mechanical and easy to review.
  Escalate behavior changes to Claude Code and release/changelog questions to
  Codex.
- Keep handoffs short: summarize changed files, validation status,
  public-behavior impact, and unresolved risk.

## Claude Code Guidance

Read [`CLAUDE.md`](CLAUDE.md) for all operating instructions, commands,
architecture, development rules, and conventions. That file is the authoritative
working guide for Claude Code in this repository.

## Codex Release Agent Guidance

Codex supports Claude Code as the release-readiness and production
stabilization reviewer. Codex should read `CODEX.md` after `CLAUDE.md` and this
file, then check implementation, validation, changelog, roadmap, TODO, package
metadata, and documentation consistency before release handoff.

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
