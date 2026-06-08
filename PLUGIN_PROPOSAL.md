# Plugin / Middleware Registration — Proposal

**Status:** Implemented — see `src/bootstrap.ts` (`ShellPlugin`,
`ShellPluginContext`, `BootstrapOptions.plugins`) and the `[Unreleased]`
CHANGELOG entry.
**Author:** Claude Code (claude-sonnet-4-6)
**Date:** 2026-06-02

---

## Problem

As downstream Spectre applications multiply, some may need to extend bootstrap
behavior — registering analytics hooks, injecting shared services, or
instrumenting the startup sequence — without forking the shell or patching
`bootstrapApp` at the call site.

The current `BootstrapOptions` lifecycle hooks (`beforeMount`, `afterMount`)
cover simple pre/post cases but do not compose well across multiple independent
extensions.

## Proposed Interface

A plugin is a plain object with an optional `install` callback:

```ts
type ShellPlugin = {
  name: string
  install: (context: ShellPluginContext) => void
}

type ShellPluginContext = {
  bootReady: Signal<boolean>
}
```

`BootstrapOptions` gains an optional `plugins` array:

```ts
type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
  beforeMount?: () => void
  afterMount?: () => void
  plugins?: ShellPlugin[]   // new
}
```

Plugins are installed after `beforeMount` and before `routes()` is called, in
declaration order. Each receives a `ShellPluginContext` with read access to
`bootReady`.

## Execution Order With Plugins

1. `beforeMount()` — existing hook
2. `plugins[N].install(context)` — each plugin in order
3. `routes()` — factory called; routes collected
4. `new Router(routes, root)`
5. `bootReady.value = true`
6. `afterMount()` — existing hook

## Constraints

- Plugins are synchronous. Async install is out of scope; if async setup is
  needed, callers use `beforeMount` with `await` at the call site.
- No plugin can override or remove another plugin's effect. Composition is
  additive only.
- `ShellPlugin.name` is required for error messages and debugging only; it is
  not a unique registry key — duplicate names are allowed.
- Plugins do not receive the router instance. Shell does not expose router
  internals.

## Why Not Now

At one downstream consumer (`spectre-shell` is only wired to a single known
application), the existing `beforeMount`/`afterMount` hooks are sufficient.
Adding a plugin API before a second real consumer exists would be speculative
design.

## Trigger for Implementation

Implement this proposal when either:

- A second independent Spectre application needs shared bootstrap extensions
  that cannot be expressed cleanly with the existing lifecycle hooks, **or**
- A concrete plugin use case is filed against this repository.

Until then, this document is the full deliverable for the P2.1 evaluation.
