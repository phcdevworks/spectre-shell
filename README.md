# @phcdevworks/spectre-shell

## Repository Snapshot

| Field | Value |
|-------|-------|
| Project team | `project-shell` |
| Repository role | Spectre app bootstrap shell |
| Package/artifact | `@phcdevworks/spectre-shell` |
| Current version/status | 1.1.1 |

## Standard Workflow

1. Read [AGENTS.md](AGENTS.md), then the agent-specific guide for the task.
2. Check [TODO.md](TODO.md) and [ROADMAP.md](ROADMAP.md) for current scope.
3. Make the smallest repo-local change that satisfies the task.
4. Run `npm run check` when validation is required or practical.
5. Update docs and [CHANGELOG.md](CHANGELOG.md) only when behavior, public
   contracts, or release-relevant metadata changed.

## Documentation Map

| Guide | Path |
|-------|------|
| Agent rules | [AGENTS.md](AGENTS.md) |
| Claude Code | [CLAUDE.md](CLAUDE.md) |
| Codex | [CODEX.md](CODEX.md) |
| Copilot | [COPILOT.md](COPILOT.md) |
| Jules | [JULES.md](JULES.md) |
| Roadmap | [ROADMAP.md](ROADMAP.md) |
| Todo | [TODO.md](TODO.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |
| Security | [SECURITY.md](SECURITY.md) |

[![npm version](https://img.shields.io/npm/v/@phcdevworks/spectre-shell.svg)](https://www.npmjs.com/package/@phcdevworks/spectre-shell)
[![CI](https://img.shields.io/github/actions/workflow/status/phcdevworks/spectre-shell/ci.yml?branch=main&label=CI)](https://github.com/phcdevworks/spectre-shell/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-shell)](LICENSE)
[![Node](https://img.shields.io/node/v/@phcdevworks/spectre-shell)](https://nodejs.org)

Thin application bootstrap shell for Spectre apps. It wires a root element to route definitions, starts the router, imports shared shell styles, and exposes a small readiness signal.

Part of the [PHCDevworks Spectre shell ecosystem](https://github.com/phcdevworks) — composable, zero-dependency packages for client-side shell applications.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Roadmap](ROADMAP.md) | [Security Policy](SECURITY.md)

## When to use this package

- You are wiring a Spectre app into a DOM root and need bootstrap lifecycle management.
- You want optional `beforeMount` / `afterMount` callbacks and a `bootReady` signal without writing the plumbing yourself.
- You are composing `@phcdevworks/spectre-shell-router` and `@phcdevworks/spectre-shell-signals` into a working shell.

## When not to use this package

- You need a full application framework — this package handles startup only.
- You need server-side rendering, SSR hydration, or meta-framework integration.
- You need application state, domain logic, or component rendering — those belong downstream.

## Capabilities

- Bootstraps a Spectre app into a provided root element.
- Accepts route factories compatible with `@phcdevworks/spectre-shell-router`.
- Runs optional `beforeMount` and `afterMount` lifecycle callbacks.
- Exposes `bootReady` as a reactive signal.
- Loads package-level shell styles through `./styles.js`.

## Install

```bash
npm install @phcdevworks/spectre-shell
```

## Quick Start

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'

const root = document.querySelector<HTMLElement>('#app')

if (!root) {
  throw new Error('Missing #app root element.')
}

bootstrapApp({
  root,
  routes: () => [
    {
      path: '/',
      loader: async () => ({
        render({ root }) {
          root.textContent = 'Ready'
        },
      }),
    },
  ],
})
```

## Bootstrap Sequence

When `bootstrapApp()` is called, the shell runs the following steps in order:

1. `beforeMount()` — optional callback fires before route registration.
2. `routes()` — the route factory is called and routes are collected.
3. `new Router(routes, root)` — routing control is handed to `@phcdevworks/spectre-shell-router`.
4. `bootReady.value = true` — the readiness signal is set.
5. `afterMount()` — optional callback fires after the router is running and `bootReady` is set.

Steps 1–4 are wrapped in an error boundary. Failures throw `[spectre-shell] Bootstrap failed: <message>` with the original error preserved as `cause`. If `afterMount` fires, bootstrap succeeded.

## API

- `bootstrapApp(options)` runs the shell bootstrap flow.
- `bootReady` is a signal that becomes `true` after the router starts.
- `BootstrapOptions` defines `root`, `routes`, `beforeMount`, and `afterMount`.

## Ecosystem

`spectre-shell` is the SPA entry point of the Spectre stack. Each package owns
a distinct layer:

| Package | Role |
| --- | --- |
| `spectre-shell` | SPA bootstrap — wires root, router, styles, and `bootReady` signal |
| `spectre-shell-router` | Client-side routing — path matching, lazy loaders, guards, named routes |
| `spectre-shell-signals` | Reactive primitives — `signal`, `computed`, `effect`, `batch` |
| `spectre-tokens` | Design token contract — CSS variables, JS values, Tailwind preset |
| `spectre-ui` | Styling layer — class recipes, CSS bundles, Tailwind integration |
| `spectre-ui-astro` | Astro component adapter — `SpButton`, `SpCard`, `SpInput`, and more |

Two deployment paths exist in the Spectre ecosystem:

- **SPA path** — `spectre-shell` bootstraps a vanilla TypeScript app into a
  DOM root via `bootstrapApp()`. Use this when building a client-side
  application without a meta-framework.
- **Astro path** — `spectre-ui-astro` delivers Spectre components as Astro
  islands. The shell is not used in this path; Astro owns the lifecycle.

## Boundaries

This package owns the bootstrap surface between an app root and Spectre routing primitives. It does not own route matching internals, general-purpose state management, component rendering, persistence, design tokens, or framework adapters.

## Server-Side Rendering

This package does not support SSR. `bootstrapApp()` assumes a live DOM
environment: it calls `new Router(routes, root)` against a real element and
sets a signal value synchronously. There is no hydration path, no
server-entry point, and no framework adapter.

SSR support will be evaluated only if a concrete integration requirement from
a WordPress or Astro context is identified. Until then, the SSR stance is:
**not supported, not planned.**

## Development

```bash
npm install
npm run check
```

Useful scripts:

- `npm run typecheck` validates TypeScript without emitting files.
- `npm run lint` runs ESLint.
- `npm run test` runs the Vitest suite once.
- `npm run build` emits declarations and JavaScript to `dist`.
- `npm run check` runs the standard package verification flow.

AI-agent coordination starts in [AGENTS.md](./AGENTS.md), with companion
guidance in [CLAUDE.md](./CLAUDE.md), [CODEX.md](./CODEX.md),
[COPILOT.md](./COPILOT.md), [JULES.md](./JULES.md), and
[.github/copilot-instructions.md](./.github/copilot-instructions.md).

### Troubleshooting

| Problem                            | Likely cause                          | Fix                                                                 |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| `npm run check` fails on typecheck | Type error in source or tests         | Run `npm run typecheck` to isolate                                  |
| Tests fail in CI but pass locally  | Node version mismatch                 | CI runs Node 22 and 24; match locally                               |
| `dist/` is missing after clone     | Build output is gitignored            | Run `npm run build`                                                 |
| `bootReady` stays `false`          | Bootstrap threw before setting signal | Check for errors in `beforeMount` or `routes()`                     |
| Styles not applied                 | `styles.js` side-effect not imported  | `bootstrapApp` handles this; verify `sideEffects` in bundler config |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The gate is `npm run check` — typecheck, lint, build, tests, and `check:ecosystem` must all pass. Do not add routing logic, state management, or rendering to this package; see [AGENTS.md](./AGENTS.md) for boundaries.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).
