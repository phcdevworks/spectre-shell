import { signal } from '@phcdevworks/spectre-shell-signals'
import { Router, type Route } from '@phcdevworks/spectre-shell-router'
import './styles.js'

export const bootReady = signal(false)

export type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
  beforeMount?: () => void
  afterMount?: () => void
}

export function bootstrapApp(options: BootstrapOptions): void {
  const { root, routes, beforeMount, afterMount } = options
  try {
    beforeMount?.()
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
