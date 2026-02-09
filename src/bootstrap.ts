import './styles'
import '@phcdevworks/spectre-components'
import { startRouter } from '@phcdevworks/spectre-shell-router'

type BootstrapOptions = {
  root: HTMLElement
  routes: () => void
}

export function bootstrapApp(options: BootstrapOptions): void {
  const { root, routes } = options

  routes()
  startRouter({ root })
}
