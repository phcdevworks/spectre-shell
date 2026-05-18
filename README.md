# @phcdevworks/spectre-shell

[![CI](https://github.com/phcdevworks/spectre-shell/actions/workflows/ci.yml/badge.svg)](https://github.com/phcdevworks/spectre-shell/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@phcdevworks/spectre-shell.svg)](https://www.npmjs.com/package/@phcdevworks/spectre-shell)

Thin application bootstrap shell for Spectre apps. It wires a root element to route definitions, starts the router, imports shared shell styles, and exposes a small readiness signal.

Part of the [PHCDevworks Spectre shell ecosystem](https://github.com/phcdevworks) — composable, zero-dependency packages for client-side shell applications.

[Issues](https://github.com/phcdevworks/spectre-shell/issues) | [Pull requests](https://github.com/phcdevworks/spectre-shell/pulls) | [Security](./SECURITY.md) | [Contributing](./CONTRIBUTING.md) | [Roadmap](./ROADMAP.md)

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

## Boundaries

This package owns the bootstrap surface between an app root and Spectre routing primitives. It does not own route matching internals, general-purpose state management, component rendering, persistence, design tokens, or framework adapters.

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

### Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `npm run check` fails on typecheck | Type error in source or tests | Run `npm run typecheck` to isolate |
| Tests fail in CI but pass locally | Node version mismatch | CI runs Node 22 and 24; match locally |
| `dist/` is missing after clone | Build output is gitignored | Run `npm run build` |
| `bootReady` stays `false` | Bootstrap threw before setting signal | Check for errors in `beforeMount` or `routes()` |
| Styles not applied | `styles.js` side-effect not imported | `bootstrapApp` handles this; verify `sideEffects` in bundler config |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The gate is `npm run check` — all of typecheck, lint, build, and tests must pass. Do not add routing logic, state management, or rendering to this package; see [AGENTS.md](./AGENTS.md) for boundaries.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).
