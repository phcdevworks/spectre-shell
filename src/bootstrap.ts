import { signal, type Signal } from '@phcdevworks/spectre-shell-signals'
import { Router, type Route, type RouterOptions } from '@phcdevworks/spectre-shell-router'
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
  routerOptions?: RouterOptions
}

export function bootstrapApp(options: BootstrapOptions): Router {
  const { root, routes, beforeMount, afterMount, plugins, routerOptions } = options
  let router: Router
  try {
    bootReady.value = false
    beforeMount?.()
    const context: ShellPluginContext = { bootReady }
    for (const plugin of plugins ?? []) {
      plugin.install(context)
    }
    const registeredRoutes = routes()
    router = new Router(registeredRoutes, root, routerOptions)
    bootReady.value = true
  } catch (err) {
    throw new Error(
      `[spectre-shell] Bootstrap failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err }
    )
  }
  afterMount?.()
  return router
}
