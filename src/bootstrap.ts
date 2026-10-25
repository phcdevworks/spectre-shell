import { signal, type Signal } from '@phcdevworks/spectre-shell-signals'
import { Router, type Route, type RouterOptions } from '@phcdevworks/spectre-shell-router'
import { startPrefetch, type PrefetchStrategy } from './prefetch.js'
import './styles.js'

export const bootReady = signal(false)

export type ShellPluginContext = {
  bootReady: Signal<boolean>
}

export type ShellPlugin = {
  name: string
  install: (context: ShellPluginContext) => void
  defer?: boolean
}

export type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
  beforeMount?: () => void
  afterMount?: () => void
  plugins?: ShellPlugin[]
  routerOptions?: RouterOptions
  prefetch?: PrefetchStrategy | false
}

const BOOTSTRAP_START = 'spectre-shell:bootstrap-start'

function mark(name: string) {
  try {
    globalThis.performance?.mark(name)
  } catch {
    // User Timing is diagnostic only and must never break startup
  }
}

function measure(name: string) {
  try {
    globalThis.performance?.measure(name, BOOTSTRAP_START)
  } catch {
    // the start mark may have been cleared by the app
  }
}

function whenIdle(callback: () => void): () => void {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(callback, { timeout: 2000 })
    return () => cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 0)
  return () => clearTimeout(id)
}

function installDeferred(plugins: ShellPlugin[], context: ShellPluginContext) {
  for (const plugin of plugins) {
    try {
      plugin.install(context)
    } catch (err) {
      const error = new Error(
        `[spectre-shell] Deferred plugin "${plugin.name}" failed: ${err instanceof Error ? err.message : String(err)}`,
        { cause: err }
      )
      if (typeof reportError === 'function') reportError(error)
      else setTimeout(() => { throw error })
    }
  }
}

export function bootstrapApp(options: BootstrapOptions): Router {
  const { root, routes, beforeMount, afterMount, plugins = [], routerOptions, prefetch = false } =
    options
  const context: ShellPluginContext = { bootReady }
  let router: Router
  mark(BOOTSTRAP_START)
  try {
    bootReady.value = false
    beforeMount?.()
    for (const plugin of plugins) {
      if (!plugin.defer) plugin.install(context)
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
  measure('spectre-shell:bootstrap')

  const deferred = plugins.filter((plugin) => plugin.defer)
  const cleanups: Array<() => void> = []
  const stopFirstRender = router.subscribe(() => {
    stopFirstRender()
    measure('spectre-shell:first-render')
    if (deferred.length > 0) cleanups.push(whenIdle(() => installDeferred(deferred, context)))
  })
  cleanups.push(stopFirstRender)
  if (prefetch) cleanups.push(startPrefetch(router, root, prefetch, routerOptions))

  const destroyRouter = router.destroy.bind(router)
  router.destroy = () => {
    for (const cleanup of cleanups.splice(0)) cleanup()
    destroyRouter()
  }

  afterMount?.()
  return router
}
