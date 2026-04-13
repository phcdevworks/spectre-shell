# @phcdevworks/spectre-shell

[![GitHub issues](https://img.shields.io/github/issues/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/pulls)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-shell)](LICENSE)

`@phcdevworks/spectre-shell` is the thin application shell for Spectre apps.
It provides a small bootstrap contract that loads shared Spectre styles,
collects application route definitions, and hands them off to
[`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router).

Maintained by PHCDevworks, this package is intentionally small. It coordinates
shell-level startup concerns, including runtime composition of routing and
reactive primitives, without taking ownership of design tokens, styling
primitives, router internals, framework adapters, or application-specific
logic.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Security Policy](SECURITY.md)

## What it does today

- Exports a single `bootstrapApp()` entry point
- Loads shared Spectre CSS from sibling packages
- Collects application route definitions before startup
- Hands those routes and the provided root to the external shell router

Current bootstrap flow:

1. import shared styles from `@phcdevworks/spectre-tokens` and `@phcdevworks/spectre-ui`
2. call the app-provided `routes()` function
3. instantiate `new Router(routes, root)`

## Installation

```bash
npm install @phcdevworks/spectre-shell
```

## Quick start

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import type { Route } from '@phcdevworks/spectre-shell-router'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Application root not found')
}

bootstrapApp({
  root,
  routes: (): Route[] => [
    { path: '/', loader: () => import('./pages/home') },
    { path: '/settings', loader: () => import('./pages/settings') }
  ]
})
```

## Public API

`@phcdevworks/spectre-shell` currently exports one symbol:

- `bootstrapApp`

Runtime contract:

```ts
import type { Route } from '@phcdevworks/spectre-shell-router'

type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
}
```

`bootstrapApp()` currently:

- expects a root element
- runs the supplied `routes()` callback
- passes the returned route definitions to the router with that root
- imports shared global styles as a side effect

`bootstrapApp()` does not currently:

- compose providers
- expose layout scaffolding APIs
- implement plugin or hook systems
- own route matching or router lifecycle behavior
- own app logic, business-domain state, or feature state

## Package boundaries

What this package owns:

- app bootstrap
- shell-level startup coordination
- shared style entrypoint aggregation
- route collection and router handoff
- shell-level runtime coordination state where that state exists to compose routing and reactivity

What this package does not own:

- design tokens and semantic token meaning
- styling primitives, CSS recipes, or reusable component styling contracts
- framework adapter delivery
- business logic, business-domain state, or feature state
- router internals when those live in
  [`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router)
- reactive primitive implementation when that lives in
  [`@phcdevworks/spectre-shell-signals`](https://github.com/phcdevworks/spectre-shell-signals)

## Relationship to the Spectre suite

Spectre keeps package responsibilities narrow:

- [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens)
  owns design tokens and semantic meaning
- [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui)
  owns public styling primitives and shared CSS implementation
- [`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router)
  owns router behavior and lifecycle
- [`@phcdevworks/spectre-shell-signals`](https://github.com/phcdevworks/spectre-shell-signals)
  owns reactive primitives
- `@phcdevworks/spectre-shell` wires shared styles, router handoff, and
  shell-level reactive coordination into a small application bootstrap contract

That separation keeps the shell truthful and easy to consume.

## Minimum Reactive Concerns

The shell may coordinate a very small set of reactive runtime concerns when that
state exists to compose routing and shell behavior, rather than application
features. The minimum valid set is:

- `bootReady`: whether shell startup has completed and the runtime frame is ready
  Rationale: this is shell lifecycle state, not application business state.
- `navigationActive`: whether the shell is currently in an active navigation transition
  Rationale: this coordinates shell runtime behavior around router handoff without moving navigation logic into the shell.
- `shellUiState`: shell-owned UI toggles such as menu, drawer, or overlay open state
  Rationale: these are shell controls, not feature or domain state.
- `routeFlags`: small route-derived runtime flags needed by the shell frame
  Rationale: these support shell coordination around the active route without taking over route matching or page state.

These concerns stay intentionally narrow. They do not include business-domain
state, feature data, async query state, caching, or a general application store.

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
