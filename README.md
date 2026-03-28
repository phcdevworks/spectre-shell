# @phcdevworks/spectre-shell

[![GitHub issues](https://img.shields.io/github/issues/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/phcdevworks/spectre-shell)](https://github.com/phcdevworks/spectre-shell/pulls)
[![License](https://img.shields.io/github/license/phcdevworks/spectre-shell)](LICENSE)

`@phcdevworks/spectre-shell` is the application shell responsible for
orchestrating app-level composition. It coordinates routing, global styling,
providers, layout scaffolding, and runtime initialization so downstream
applications can boot with a consistent structure and predictable behavior.

Maintained by PHCDevworks, this is the application orchestration layer in the
Spectre suite. It sits above
[`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui) and
adapter packages, taking visual and component primitives and wiring them into a
working app frame without taking ownership of token contracts, styling
internals, or application-specific business logic.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Security Policy](SECURITY.md)

## Key capabilities

- Bootstraps Spectre applications through a shared `bootstrapApp()` entry point
- Coordinates global stylesheet loading for downstream app startup
- Integrates routing setup with app initialization instead of embedding router
  internals directly into apps
- Provides a consistent shell contract for root mounting and startup flow
- Establishes the shared application frame that downstream apps build within
- Keeps orchestration concerns separate from tokens, styling primitives, and
  business logic

## Installation

```bash
npm install @phcdevworks/spectre-shell
```

## Quick start

### Basic usage

Bootstrap a Spectre application from a single entry point:

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

bootstrapApp({
  root: document.getElementById('app')!,
  routes: () => {
    defineRoutes([
      { path: '/', loader: () => import('./pages/home') },
      { path: '/settings', loader: () => import('./pages/settings') }
    ])
  }
})
```

### Shell setup / bootstrap example

The shell coordinates startup concerns so applications do not repeat the same
boot logic across projects:

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'

const root = document.getElementById('app')

if (!root) {
  throw new Error('Application root not found')
}

bootstrapApp({
  root,
  routes: () => {
    // Register application routes before the router starts
  }
})
```

The default shell flow is:

1. load shared Spectre styling for the application frame
2. register application routes
3. start the runtime shell against the provided root element

### Optional routing / layout composition example

Routing can remain externalized while the shell coordinates its startup. Layout
composition stays at the application boundary instead of being embedded into the
router itself.

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

function withAppLayout(content: string) {
  return `
    <div class="app-shell">
      <header class="app-shell__header">Spectre App</header>
      <main class="app-shell__content">${content}</main>
    </div>
  `
}

bootstrapApp({
  root: document.getElementById('app')!,
  routes: () => {
    defineRoutes([
      {
        path: '/',
        loader: async () => ({
          render(ctx) {
            ctx.root.innerHTML = withAppLayout('<h1>Home</h1>')
          }
        })
      }
    ])
  }
})
```

If routing is delegated to
[`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router),
`@phcdevworks/spectre-shell` coordinates that router as part of app startup
rather than owning router behavior itself.

## What this package owns

- Application bootstrapping through a shared shell entry point
- Coordination of routing startup for downstream applications
- Global styling initialization needed for the Spectre app frame
- Shell-level composition concerns such as root mounting, providers, and layout
  scaffolding
- Runtime initialization flow that gives downstream apps a predictable startup
  contract

Golden rule: orchestrate shared app composition, do not redefine lower-layer
contracts.

## What this package does not own

- Design values or semantic meaning That belongs to
  [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens).
- Primitive styling contracts or reusable CSS implementation That belongs to
  [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui).
- Router internals If routing is externalized, packages such as
  [`@phcdevworks/spectre-shell-router`](https://github.com/phcdevworks/spectre-shell-router)
  own path matching, navigation behavior, and page lifecycle implementation.
- App-specific business logic, feature state, and domain concerns Downstream
  applications own those responsibilities.

## Package exports / API surface

### Root package

`@phcdevworks/spectre-shell` currently exports:

- `bootstrapApp`

Example:

```ts
import { bootstrapApp } from '@phcdevworks/spectre-shell'

bootstrapApp({
  root: document.getElementById('app')!,
  routes: () => {
    // register routes here
  }
})
```

### Runtime contract

The bootstrap contract is intentionally small:

```ts
type BootstrapOptions = {
  root: HTMLElement
  routes: () => void
}
```

Applications provide the root mount node and route registration function. The
shell handles shared startup flow from there.

## Relationship to the rest of Spectre

Spectre keeps responsibilities separate:

- [`@phcdevworks/spectre-tokens`](https://github.com/phcdevworks/spectre-tokens)
  defines design values and semantic meaning
- [`@phcdevworks/spectre-ui`](https://github.com/phcdevworks/spectre-ui) turns
  those tokens into reusable CSS, Tailwind tooling, and shared styling
  behavior
- `@phcdevworks/spectre-shell` coordinates those lower layers into a shared
  application frame and runtime bootstrap contract
- Router and adapter packages extend that frame with specialized capability or
  framework-specific delivery

That separation keeps application structure predictable while avoiding overlap
between design tokens, styling implementation, routing capability, and app
logic.

## Development

Build the package:

```bash
npm run build
```

Key source areas:

- `src/bootstrap.ts` for application bootstrap orchestration
- `src/styles.ts` for shell-managed style imports
- `src/index.ts` for package exports

## Contributing

PHCDevworks maintains this package as part of the Spectre suite.

When contributing:

- keep the shell focused on orchestration, not visual definition
- keep routing coordination separate from router internals
- avoid introducing app-specific behavior into the shared shell
- run `npm run build` before opening a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

MIT © PHCDevworks. See [LICENSE](LICENSE).
