import { Router, type Route } from '@phcdevworks/spectre-shell-router'
import './styles.js'

export type BootstrapOptions = {
  root: HTMLElement
  routes: () => Route[]
}

export function bootstrapApp(options: BootstrapOptions): void {
  const { root, routes } = options
  const registeredRoutes = routes()

  new Router(registeredRoutes, root)
}
