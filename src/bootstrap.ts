import { signal, type Signal } from '@phcdevworks/spectre-shell-signals'
import { Router, type Route } from '@phcdevworks/spectre-shell-router'
import './styles.js'

export const bootReady = signal(false)

export type ShellPluginContext = {
  bootReady: Signal<boolean>
}

export type ShellPlugin = {
  name: string
  install: (context: ShellPluginContext) => void
}

export type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
  beforeMount?: () => void
  afterMount?: () => void
  plugins?: ShellPlugin[]
}

export function bootstrapApp(options: BootstrapOptions): void {
  const { root, routes, beforeMount, afterMount, plugins } = options
  try {
    beforeMount?.()
    const context: ShellPluginContext = { bootReady }
    for (const plugin of plugins ?? []) {
      plugin.install(context)
    }
    const registeredRoutes = routes()
    new Router(registeredRoutes, root)
    bootReady.value = true
  } catch (err) {
    throw new Error(
      `[spectre-shell] Bootstrap failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err }
    )
  }
  afterMount?.()
}
