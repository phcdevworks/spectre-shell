# @phcdevworks/spectre-shell

Thin, framework-agnostic app shell for the Spectre platform. Provides routing, styling, and application bootstrapping for vanilla TypeScript apps.

🤝 **[Contributing Guide](CONTRIBUTING.md)** | 📝 **[Changelog](CHANGELOG.md)**

## Overview

`@phcdevworks/spectre-shell` is a lightweight application shell that combines routing, styling, and initialization into a single bootstrap function. It's designed for building modern web apps without heavy frameworks.

- ✅ Built-in client-side routing via `@phcdevworks/spectre-shell-router`
- ✅ Pre-configured Spectre UI styling and design tokens
- ✅ Simple `bootstrapApp()` initialization
- ✅ Framework-agnostic and TypeScript-first
- ✅ Zero configuration required to get started
- ✅ Minimal surface area—easy to understand and extend

## Installation

```bash
npm install @phcdevworks/spectre-shell
```

## Usage

### Quick Start

```typescript
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

// Define your routes
const routes = () => {
  defineRoutes([
    { path: '/', loader: () => import('./pages/home') },
    { path: '/about', loader: () => import('./pages/about') },
    { path: '/users/:id', loader: () => import('./pages/user') },
  ])
}

// Bootstrap your app
bootstrapApp({
  root: document.getElementById('app')!,
  routes,
})
```

### Create Page Modules

Each page module must export a `render` function:

```typescript
// pages/home.ts
export function render(ctx: RouteContext) {
  ctx.root.innerHTML = `
    <div class="container">
      <h1>Welcome to Spectre Shell</h1>
      <a href="/about">About</a>
    </div>
  `
}

export function destroy() {
  // Optional cleanup
  console.log('Leaving home page')
}
```

### HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Spectre App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## What's Included

The Spectre Shell bundles and configures:

1. **[@phcdevworks/spectre-shell-router](https://github.com/phcdevworks/spectre-shell-router)** - Client-side routing with path parameters and lifecycle hooks
2. **[@phcdevworks/spectre-ui](https://github.com/phcdevworks/spectre-ui)** - Core styling layer with utility classes
3. **[@phcdevworks/spectre-tokens](https://github.com/phcdevworks/spectre-tokens)** - Design tokens for consistent theming

All styles are pre-imported and ready to use—no additional configuration needed.

## Features

✅ **Client-side routing** with path parameters (`/users/:id`)  
✅ **Spectre UI styling** automatically loaded  
✅ **Design tokens** for consistent theming  
✅ **Page lifecycle hooks** (`render`, `destroy`)  
✅ **TypeScript-first** with full type definitions  
✅ **Framework-agnostic** - works with vanilla JS/TS  
✅ **Minimal bundle size** - only what you need

## Bootstrap API

### `bootstrapApp(options)`

Initializes your application with routing and styling.

```typescript
type BootstrapOptions = {
  root: HTMLElement      // Container element for your app
  routes: () => void     // Function that defines your routes
}

bootstrapApp(options: BootstrapOptions): void
```

**Example:**

```typescript
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

bootstrapApp({
  root: document.getElementById('app')!,
  routes: () => {
    defineRoutes([
      { path: '/', loader: () => import('./pages/home') },
      { path: '/about', loader: () => import('./pages/about') },
    ])
  },
})
```

## Page Contract

Each page module must export a `render` function:

```typescript
export function render(ctx: RouteContext): void
export function destroy?(): void  // optional cleanup
```

**RouteContext** provides:

- `path` – The matched URL path
- `params` – Route parameters (e.g., `{ id: '123' }`)
- `query` – URLSearchParams object
- `root` – The DOM element where the page renders

**Example page:**

```typescript
// pages/user.ts
export function render(ctx: RouteContext) {
  const userId = ctx.params.id

  ctx.root.innerHTML = `
    <div class="container">
      <h1>User ${userId}</h1>
      <a href="/">Back to Home</a>
    </div>
  `
}

export function destroy() {
  // Clean up event listeners, timers, etc.
  console.log('Cleaning up user page')
}
```

## Using Spectre UI Styles

All Spectre UI styles are automatically loaded. Use utility classes in your pages:

```typescript
export function render(ctx: RouteContext) {
  ctx.root.innerHTML = `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold text-primary">Hello Spectre</h1>
      <button class="btn btn-primary mt-4">Click Me</button>
    </div>
  `
}
```

For complete documentation on available styles, see [@phcdevworks/spectre-ui](https://github.com/phcdevworks/spectre-ui).

## Development Philosophy

Spectre Shell follows a **thin shell** approach:

### 1. App Shell

**Purpose**: Minimal glue between routing, styling, and initialization

**Rules**:

- Keep the API surface tiny—just `bootstrapApp()`
- Bundle only essential dependencies
- No magic or hidden configuration
- TypeScript strict mode with full type exports

### 2. Composable Architecture

**Contains**:

- Router for navigation
- UI framework for styling
- Bootstrap function for initialization

**Rules**:

- Each layer is independent and replaceable
- No tight coupling between components
- Clear separation of concerns

### Golden Rule (Non-Negotiable)

**The shell should be boring, transparent, and easy to delete.**

Spectre Shell exists to wire up routing and styling with minimal ceremony, not to impose framework patterns.

## Design Principles

1. **Thin by design** - Minimal API surface, maximum flexibility
2. **Framework-agnostic** - Works with vanilla JS/TS, no heavy dependencies
3. **Type-safe** - Full TypeScript support throughout
4. **Batteries included** - Routing + styling pre-configured
5. **Easily replaceable** - Simple enough to swap out if needs change

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import type { RouteContext } from '@phcdevworks/spectre-shell-router'
```

## Project Structure

Recommended project structure:

```
my-app/
├── src/
│   ├── pages/
│   │   ├── home.ts       # Page modules
│   │   ├── about.ts
│   │   └── user.ts
│   └── main.ts           # App entry point
├── index.html
├── package.json
└── tsconfig.json
```

**main.ts:**

```typescript
import { bootstrapApp } from '@phcdevworks/spectre-shell'
import { defineRoutes } from '@phcdevworks/spectre-shell-router'

bootstrapApp({
  root: document.getElementById('app')!,
  routes: () => {
    defineRoutes([
      { path: '/', loader: () => import('./pages/home') },
      { path: '/about', loader: () => import('./pages/about') },
      { path: '/users/:id', loader: () => import('./pages/user') },
    ])
  },
})
```

## Part of the Spectre Suite

- **Spectre Tokens** - Design token foundation
- **Spectre UI** - Core styling layer
- **Spectre Shell** - Application shell framework (this package)
- **Spectre Shell Router** - Client-side routing
- **Spectre Blocks** - WordPress block library
- **Spectre Astro** - Astro integration

## Contributing

Issues and pull requests are welcome. For detailed contribution guidelines, see **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## License

MIT © PHCDevworks — See **[LICENSE](LICENSE)** for details.

---

## ❤️ Support Spectre

If Spectre Shell helps your workflow, consider sponsoring:

- [GitHub Sponsors](https://github.com/sponsors/phcdevworks)
- [Buy Me a Coffee](https://buymeacoffee.com/phcdevworks)
