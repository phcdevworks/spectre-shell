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

Human final review, release decisions, tagging, publishing, and merge authority
rest with Bradley Potts (<brad.potts@coastdigitalgroup.com>). Claude Code, Codex,
and Copilot do not commit by default. Jules may commit and push only bounded
automated maintenance when `JULES.md` explicitly allows it and all validation
gates pass.

## Instruction Map

| File                              | Audience                     | Purpose                                                            |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                       | All agents, especially Codex | Central role model, coordination rules, verification gate          |
| `CLAUDE.md`                       | Claude Code                  | Lead-development guide for implementation, architecture, and tests |
| `CODEX.md`                        | OpenAI Codex                 | Release-readiness, production stabilization, and config posture    |
| `JULES.md`                        | Google Jules                 | Bounded automated maintenance guidance                             |
| `COPILOT.md`                      | GitHub Copilot               | Role summary and development boundaries for GitHub Copilot         |
| `.github/copilot-instructions.md` | GitHub Copilot               | In-editor suggestion boundaries                                    |
| `.claude/settings.json`           | Claude Code runtime          | Local command denies for commit, push, tag, merge, and publish     |
| `.coderabbit.yaml`                | CodeRabbit                   | Automated review checks aligned with package boundaries            |
| `.github/dependabot.yml`          | Dependabot / Jules handoff   | Dependency-update cadence for automated maintenance                |

## Claude Code - Lead Developer

**Claude Code** (`claude-sonnet-4-6`) is the designated primary AI developer for
this repository, maintained on behalf of Bradley Potts at PHCDevworks. All
development is driven through Claude Code operating from `CLAUDE.md` as the
authoritative working guide.

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
downstream SPA applications by loading shared styles, running route
registration, and handing startup off to the external router.

The foundation is stable at v1.1.0. The current focus is Phase 2: wiring the
full ecosystem into usable SPA applications, implementing the plugin system,
and documenting the integration story for downstream consumers. See ROADMAP.md
and TODO.md for the active work queue.

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

- Design values and semantic meaning belong in `@phcdevworks/spectre-tokens`.
- Primitive styling contracts and reusable CSS implementation belong in
  `@phcdevworks/spectre-ui`.
- Router internals such as path matching, navigation behavior, and lifecycle
  sequencing belong in `@phcdevworks/spectre-shell-router`.
- Reactive signal primitives belong in `@phcdevworks/spectre-shell-signals`.
- Shell responsibilities belong here: bootstrap flow, root mounting, shared
  style initialization, route registration, and router startup coordination.
- App-specific state, feature logic, and domain behavior belong in downstream
  applications.

## Shared Edit Permissions

| Path | Status | Notes |
| --- | --- | --- |
| `src/` | **May edit** | Bootstrap implementation; public API changes require a test and changelog entry |
| `tests/` | **May edit** | All public behavior changes require test coverage |
| `CHANGELOG.md` | **May edit** | Entry required for every user-visible or public API change |
| `README.md` | **May edit** | Keep aligned with public API and bootstrap sequence |
| `package.json` | **May edit** | Exports, version, and dependencies must match built output and runtime behavior |
| `ROADMAP.md`, `TODO.md` | **May edit** | Keep current; mark items done when they ship |
| `dist/` | **Never edit directly** | Always regenerated by `tsc`; manual edits are immediately overwritten |
| `spectre.manifest.json` | **May edit** | Update when exports, Spectre dependencies, or stability change |

## Pull Request Creation

Every agent that opens a PR must populate every section of the repo's PR
template (`.github/pull_request_template.md`):

- **Summary** - linked issue (`#N` or `N/A`) and one or two bullets describing
  what changed and why.
- **Type of Change** - check every box that applies.
- **Package Boundary Check** - confirm the change stays within shell
  orchestration scope and does not drift into router, signals, tokens, or UI.
- **Public API Impact** - state whether the public contract changed; include
  migration notes if it did.
- **Validation** - confirm `npm run check` was run and the result.
- **Documentation Updated** - confirm `README.md` and `CHANGELOG.md` are in sync.
- **Release Impact** - select patch, minor, major, or none.
- **Codex Review Needed** - flag when documentation, release notes, or
  production safety review is warranted.

Never submit a PR with an empty body or only the template headings left unfilled.

## Validation

Full validation gate: `npm run check`.

This runs: typecheck -> lint -> build -> test. All gates must pass before any PR
merge. CI enforces the same gate on Node 22 and Node 24.

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

## Agent-Specific Guides

- `CLAUDE.md` - primary development authority and implementation workflow.
- `CODEX.md` - documentation, release, stabilization, and repo hygiene workflow.
- `JULES.md` - bounded automated maintenance workflow.
- `COPILOT.md` and `.github/copilot-instructions.md` - support-assistant workflow.

## Ecosystem Manifest

`spectre.manifest.json` at the root is this package's declaration in the Spectre
ecosystem contract, validated by `@phcdevworks/spectre-manifest`. It records role,
layer, exports, and allowed Spectre dependency targets. `check:ecosystem` validates
it as part of `npm run check`.

Keep `spectre.manifest.json` in sync when:
- Package exports in `package.json` are added or removed
- A Spectre package dependency is added or removed
- The package stability changes

Do not add a `consumers` field — that belongs in the central
`@phcdevworks/spectre-manifest` registry.
