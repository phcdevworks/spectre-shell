# AGENTS.md - spectre-shell

## Repository Snapshot

| Field | Value |
|-------|-------|
| Project team | `project-shell` |
| Repository role | Spectre app bootstrap shell |
| Package/artifact | `@phcdevworks/spectre-shell` |
| Validation gate | `npm run check` |

## Standard Authority Model

| Agent | Role | Authority |
|-------|------|-----------|
| Claude Code | Lead implementation and validation | [CLAUDE.md](CLAUDE.md) |
| OpenAI Codex | Documentation, release readiness, stabilization, and repo hygiene | [CODEX.md](CODEX.md) |
| ChatGPT | Strategy, coordination, prompt design, and external review | Support only |
| GitHub Copilot | Development assistance | [COPILOT.md](COPILOT.md) |
| Google Jules | Bounded automated maintenance | [JULES.md](JULES.md) |

**All AI agents in this roster** — Claude Code, OpenAI Codex, GitHub Copilot,
and Google Jules — have full commit, push, and tag authority in this
repository, effective 2026-07-25 by explicit direction from Bradley Potts —
see the Commit Policy section in each agent's own guide
([CLAUDE.md](CLAUDE.md), [CODEX.md](CODEX.md), [COPILOT.md](COPILOT.md),
[JULES.md](JULES.md)). **OpenAI Codex** additionally has release authority:
Codex cuts releases autonomously — version bump, changelog versioning,
`v<version>` git tag, and GitHub Release publish via `gh` — for every
release-ready `CHANGELOG.md [Unreleased]` section, without waiting for
per-release approval; see `CODEX.md` "Release Readiness Checklist" for the
full procedure. **npm publishing remains Bradley Potts's sole authority** —
no agent runs `npm publish`. Bradley Potts retains ultimate ownership and
can revoke or narrow any of this at any time. This grant covers git and
release operations within each agent's own scope of work as defined above —
it does not expand what any agent is authorized to decide otherwise.
ChatGPT has no repository access and is excluded.

## Cross-Repo Access

This repo may be worked on standalone or alongside any combination of other
PHCDevworks repos — do not assume the company root or sibling project areas
are present. The following rules are self-contained and apply whether or not
that broader context is available.

**File access.** An agent working in this repo has full read/write access to
every file in this repo. When this repo is present alongside other
PHCDevworks repos (company root or sibling `project-*` areas), the same full
read/write access extends to those repos too — there is no per-repo access
restriction anywhere in this workspace. What differs repo-to-repo is not
*access*, it's *editorial ownership*: each repo's own `CLAUDE.md`/`AGENTS.md`
still governs what changes make sense there (design-token authority, layer
boundaries, etc.) — being able to open and edit a file is not the same as it
being this repo's job to change it.

**Cross-repo changelog and TODO/roadmap requests.** Full rules: company root
[AGENTS.md](../../AGENTS.md) § "Cross-Repo Changelog Sync" and § "Upstream
Requests and Roadmap Self-Expansion." Applied here without exception — this
repo may append `[Unreleased]` changelog entries and downstream TODO requests
to other present repos per those rules, and no AI agent creates commits, tags,
publishes packages, or merges changes in this repo or any other unless that
repo's own agent guide explicitly grants that authority.

## Standard Handoff

Every AI-prepared change should report files changed, validation performed,
public behavior or contract impact, and unresolved risks. Do not edit generated
outputs directly. Do not update [CHANGELOG.md](CHANGELOG.md) unless the change
is release-relevant.

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

## Mission

Coordinate thin shell startup for Spectre apps. This package bootstraps
downstream SPA applications by loading shared styles, running route
registration, and handing startup off to the external router.

The foundation and Phase 2 (ecosystem integration) are complete at v1.2.0. The
current focus is Phase 3: broader adoption via a starter template/scaffolding
and evaluating framework adapters. See ROADMAP.md and TODO.md for the active
work queue.

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
8. All `scripts/` tooling is TypeScript (`.ts`), run via
   `node --experimental-strip-types`; never add a new `.js`/`.mjs` script.

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

## Upstream Requests and Roadmap Self-Expansion

Full directive: project-team [AGENTS.md](../AGENTS.md) "Upstream Requests and
Roadmap Self-Expansion." Applied to this repo:

- This repo is the integration point — its upstream dependencies are
  `spectre-shell-router`, `spectre-shell-signals`, and (from `project-design`)
  `spectre-tokens` and `spectre-ui`. If bootstrap orchestration needs a router
  event, signal primitive, token, or UI recipe that doesn't exist upstream,
  append the request to the owning repo's `TODO.md` under `## Requested by
  Downstream`, dated, with the reason and a link back to this repo's own
  TODO.md/ROADMAP.md.
- Downstream repo `spectre-init` scaffolds against this package's public API.
  It may append requests (e.g. a new `BootstrapOptions` field or lifecycle
  hook) to this repo's own `TODO.md` under `## Requested by Downstream`. Keep
  that section visible and separate from self-planned shell work.
- This repo's own [ROADMAP.md](ROADMAP.md) may be proactively expanded with new
  or reordered phases by the agent's own analysis — but never mark a phase
  delivered without `npm run check` passing, and never move token meaning,
  styling primitives, or router/signals internals into this package to avoid
  an upstream request (see Working Boundaries above).
- Surface any new TODO request or roadmap expansion in the handoff for Bradley
  Potts in the same change it was made, and reflect cross-repo-relevant
  changes in the project-team's own ROADMAP.md/TODO.md.

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

This runs: typecheck -> lint -> build -> test -> check:ecosystem. All gates must
pass before any PR merge. CI enforces the same gate on Node 22 and Node 24.

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
