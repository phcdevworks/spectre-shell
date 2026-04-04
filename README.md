# @phcdevworks/spectre-shell

[![GitHub issues](https://img.shields.io/github/issues/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/pulls)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-shell)](LICENSE)

`@phcdevworks/spectre-shell` is the thin application shell for Spectre apps.
It provides a small bootstrap contract that loads shared Spectre styles,
registers application routes, and hands off startup to
[`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router).

Maintained by PHCDevworks, this package is intentionally small. It coordinates
shell-level startup concerns without taking ownership of design tokens, styling
primitives, router internals, framework adapters, or application-specific
logic.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Security Policy](SECURITY.md)

## What it does today

- Exports a single `bootstrapApp()` entry point
- Loads shared Spectre CSS from sibling packages
- Runs application route registration before startup
- Starts the external shell router against a provided root element

Current bootstrap flow:

1. import shared styles from `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
2. call the app-provided `routes()` function
3. call `startRouter({ root })`

## Installation

```bash
npm install @phcdevworks/spectre-shell
```

## Quick start

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Application root not found')
}

bootstrapApp({
  root,
  routes: () => {
    defineRoutes([
      { path: '/', loader: () => import('./pages/home') },
      { path: '/settings', loader: () => import('./pages/settings') }
    ])
  }
})
```

## Public API

`@phcdevworks/spectre-shell` currently exports one symbol:

- `bootstrapApp`

Runtime contract:

```ts
type BootstrapOptions = {
  root: HTMLElement
  routes: () => void
}
```

`bootstrapApp()` currently:

- expects a root element
- runs the supplied `routes()` callback
- starts the router with that root
- imports shared global styles as a side effect

`bootstrapApp()` does not currently:

- compose providers
- expose layout scaffolding APIs
- implement plugin or hook systems
- own route matching or router lifecycle behavior

## Package boundaries

What this package owns:

- app bootstrap
- shell-level startup coordination
- shared style entrypoint aggregation
- route registration and router handoff

What this package does not own:

- design tokens and semantic token meaning
- styling primitives, CSS recipes, or reusable component styling contracts
- framework adapter delivery
- feature logic, business rules, or app state
- router internals when those live in
  [`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router)

## Relationship to the Spectre suite

Spectre keeps package responsibilities narrow:

- [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens)
  owns design tokens and semantic meaning
- [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui)
  owns public styling primitives and shared CSS implementation
- [`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router)
  owns router behavior and lifecycle
- `@phcdevworks/spectre-shell` wires shared styles and router startup into a
  small application bootstrap contract

That separation keeps the shell truthful and easy to consume.

## Not implemented yet

This package does not yet provide provider composition APIs, layout scaffolding
APIs, or richer runtime initialization hooks. Those are possible future
extension areas, but they are not part of the current public contract.

## Development

Build the package:

```bash
npm run build
```

Key source areas:

- `src/bootstrap.ts` for bootstrap orchestration
- `src/styles.ts` for shared style imports
- `src/index.ts` for the package entrypoint

## Contributing

PHCDevworks maintains this package as part of the Spectre suite.

When contributing:

- keep the shell focused on orchestration, not visual definition
- keep the bootstrap contract small and stable
- keep routing coordination separate from router internals
- avoid introducing app-specific behavior into the shared shell
- run `npm run build` before opening a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

MIT © PHCDevworks. See [LICENSE](LICENSE).
