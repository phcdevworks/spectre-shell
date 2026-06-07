import { bootstrapApp, bootReady } from '@phcdevworks/spectre-shell'
import { effect } from '@phcdevworks/spectre-shell-signals'
import type { Route } from '@phcdevworks/spectre-shell-router'
import '@phcdevworks/spectre-tokens/index.css'
import '@phcdevworks/spectre-ui/index.css'

const root = document.getElementById('app')
if (!(root instanceof HTMLElement)) {
  throw new Error('[example] #app root element not found')
}

const routes = (): Route[] => [
  { path: '/', name: 'home', loader: () => import('./routes/home.js').then((m) => m.default()) },
  { path: '/about', name: 'about', loader: () => import('./routes/about.js').then((m) => m.default()) }
]

bootstrapApp({
  root,
  routes,
  afterMount: () => {
    effect(() => {
      document.title = bootReady.value
        ? 'Spectre Shell — Minimal SPA (ready)'
        : 'Spectre Shell — Minimal SPA (booting)'
    })
  }
})
