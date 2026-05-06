# @phcdevworks/spectre-shell

Thin application bootstrap shell for Spectre apps. It wires a root element to route definitions, starts the router, imports shared shell styles, and exposes a small readiness signal.

[Issues](https://github.com/phcdevworks/spectre-shell/issues) | [Pull requests](https://github.com/phcdevworks/spectre-shell/pulls) | [Security](./SECURITY.md) | [Contributing](./CONTRIBUTING.md)

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

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. See [LICENSE](./LICENSE).
