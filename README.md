# @phcdevworks/spectre-shell

`@phcdevworks/spectre-shell` is the app bootstrap shell package of the
Spectre system. It wires a root element to route definitions, starts the
router, imports shared shell styles, and exposes a small readiness signal for
Spectre apps.

Maintained by [PHCDevworks](https://go.phcdev.co). It is the app-layer
integration point that composes `spectre-shell-router` and
`spectre-shell-signals` with `spectre-tokens` and `spectre-ui` from
`project-design`, without owning router, signals, or styling internals
itself.

## Repository Snapshot

| Field | Value |
|-------|-------|
| Project team | `project-shell` |
| Repository role | Spectre app bootstrap shell |
| Package/artifact | `@phcdevworks/spectre-shell` |
| Current version/status | 1.6.0 |

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

Part of the [PHCDevworks Spectre shell ecosystem](https://github.com/phcdevworks) — composable packages for client-side shell applications.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Roadmap](ROADMAP.md) | [Security Policy](SECURITY.md)

## When To Use This Package

- You are wiring a Spectre app into a DOM root and need bootstrap lifecycle management.
- You want optional `beforeMount` / `afterMount` callbacks and a `bootReady` signal without writing the plumbing yourself.
- You are composing `@phcdevworks/spectre-shell-router` and `@phcdevworks/spectre-shell-signals` into a working shell.

## When Not To Use This Package

- You need a full application framework — this package handles startup only.
- You need server-side rendering, SSR hydration, or meta-framework integration.
- You need application state, domain logic, or component rendering — those belong downstream.

## Capabilities

- Bootstraps a Spectre app into a provided root element.
- Accepts route factories compatible with `@phcdevworks/spectre-shell-router`.
- Runs optional `beforeMount` and `afterMount` lifecycle callbacks.
- Installs optional shell plugins before route registration.
- Returns the router instance for programmatic navigation and subscriptions.
- Exposes `bootReady` as a reactive signal.
- Loads package-level shell styles through `./styles.js`.

## Installation

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

1. `bootReady.value = false` — resets readiness for this bootstrap attempt.
2. `beforeMount()` — optional callback fires before plugin setup and route registration.
3. `plugins[].install({ bootReady })` — optional plugins run in declaration order.
4. `routes()` — the route factory is called and routes are collected.
5. `new Router(routes, root, routerOptions)` — routing control is handed to `@phcdevworks/spectre-shell-router`.
6. `bootReady.value = true` — synchronous shell startup has succeeded.
7. `afterMount()` — optional callback fires after router construction and the readiness update.

Steps 1–6 are wrapped in an error boundary. Synchronous failures throw
`[spectre-shell] Bootstrap failed: <message>` with the original error preserved
as `cause`. `afterMount` runs outside that boundary; an error in it leaves
`bootReady` true.

Initial route loading and rendering are asynchronous. Neither `bootReady` nor
`afterMount` waits for page content. Use `routerOptions.afterNavigate` for work
that requires a rendered route, and `routerOptions.onError` for navigation or
loader failures. Those failures belong to the router and do not reset shell
readiness.

`bootReady` is shared across this module's bootstrap calls and describes the
latest attempt, not each individual router. Destroy the previous router before
restarting the shell. A failed restart leaves readiness false; destroying a
router alone does not update this signal. Hooks and plugin installation are
synchronous; bootstrap does not await returned promises.

## API

- `bootstrapApp(options)` runs the shell bootstrap flow and returns the
  `Router` instance created from `options.routes()`, giving consumers direct
  access to `router.navigate()`, `router.back()`/`forward()`, and
  `router.subscribe()`.
- `bootReady` resets to `false` at the start of each bootstrap attempt and becomes
  `true` after synchronous router construction succeeds.
- `BootstrapOptions` defines `root`, `routes`, `beforeMount`, `afterMount`,
  `plugins`, and optional `routerOptions`. `routerOptions` is forwarded
  unchanged to the router constructor, enabling router lifecycle hooks such as
  `afterNavigate`, `onNavigationStart`, and `onNavigationEnd`.
- `ShellPlugin` defines a named `install(context)` callback. The context exposes
  `bootReady` for read/write signal access during plugin setup.

```ts
import { effect } from '@phcdevworks/spectre-shell-signals'
import { bootstrapApp, bootReady, type ShellPlugin } from '@phcdevworks/spectre-shell'

const analyticsPlugin: ShellPlugin = {
  name: 'analytics',
  install({ bootReady }) {
    console.debug('Shell ready before routes:', bootReady.value)
  },
}

effect(() => {
  console.debug('Shell ready:', bootReady.value)
})

const router = bootstrapApp({
  root,
  routes: () => [...],
  plugins: [analyticsPlugin],
  beforeMount() {
    console.debug('Preparing routes')
  },
  afterMount() {
    console.debug('Shell startup complete')
  },
})

router.navigate('/about')
```

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
- `npm run typecheck:tools` checks tests, public API type assertions, scripts,
  and configuration after `npm run build` has generated declarations.
- `npm run check:package` installs a packed tarball into a temporary consumer,
  checks public imports/types, and builds with shell-provided CSS. It requires
  registry access and removes its temporary files when finished.
- `npm run check` runs the full verification flow, including both checks above.
- `npm run check:dependencies` reports npm updates and workflow action releases;
  it requires registry access and an authenticated `gh` CLI.

A weekly dependency-report workflow records available updates in its run
summary. It has read-only permissions and does not create pull requests.
For maintenance, review the report and release notes, update the intended
manifests and lockfile, run `npm run check` plus the example typecheck/build,
then commit with the configured human identity and push directly to `main`.
Dependency changes that affect consumers also require a changelog entry.
The workflow can also be started manually from the repository's Actions page.

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

## AI And Automation Boundaries

Claude Code (`claude-sonnet-4-6`) is the primary development agent for this
repository. Codex handles releases, including cutting tagged releases and
GitHub Releases, and production stabilization. Jules handles small automated
fixes and dependency updates. GitHub Copilot provides development support.

Codex, Copilot, and Jules have commit, push, and tag authority in this
repository. Claude Code has no git access and hands validated changes to
Codex or Bradley Potts. Authorized git work goes directly to `main`. Publishing to npm
remains Bradley Potts's sole authority. See [AGENTS.md](AGENTS.md) for the
full commit-policy and release-authority grant.

**Protected from automated change:** the bootstrap-only scope (no routing
logic, state management, persistence, or rendering added locally). See
[AGENTS.md](AGENTS.md) for full agent governance and boundary rules.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The full gate is `npm run check`, including test/tooling types and the packed-consumer check. Do not add routing logic, state management, or rendering to this package; see [AGENTS.md](./AGENTS.md) for boundaries.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).
