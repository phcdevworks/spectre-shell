import type { Router, RouterOptions } from '@phcdevworks/spectre-shell-router'

export type PrefetchStrategy = 'intent' | 'viewport'

// Short enough to feel instant, long enough to ignore a pointer sweeping across links.
const HOVER_DELAY_MS = 65

function prefersSavingData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return connection?.saveData === true
}

function findLink(event: Event): HTMLAnchorElement | undefined {
  return event
    .composedPath()
    .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
}

function normalizeBasePath(basePath: string | undefined): string {
  if (!basePath || basePath === '/') return ''
  return (basePath.startsWith('/') ? basePath : `/${basePath}`).replace(/\/+$/, '')
}

export function startPrefetch(
  router: Router,
  root: HTMLElement,
  strategy: PrefetchStrategy,
  routerOptions: RouterOptions = {}
): () => void {
  const hashMode = routerOptions.mode === 'hash'
  const basePath = normalizeBasePath(routerOptions.basePath)
  const prefetched = new Set<string>()
  let hoverTimer: ReturnType<typeof setTimeout> | undefined

  // Mirrors the router's link-interception rules so only links it would route get warmed.
  const routePath = (link: HTMLAnchorElement): string | null => {
    if (
      link.target ||
      link.hasAttribute('download') ||
      link.getAttribute('rel') === 'external' ||
      !link.href
    ) {
      return null
    }
    const url = new URL(link.href)
    if (url.origin !== window.location.origin) return null
    const path = hashMode ? hashPath(url) : historyPath(url)
    return path === null ? null : path.split(/[?#]/)[0] || '/'
  }

  const hashPath = (url: URL): string | null =>
    url.hash.startsWith('#/') ? url.hash.slice(1) : null

  const historyPath = (url: URL): string | null => {
    if (!basePath) return url.pathname
    if (url.pathname === basePath) return '/'
    return url.pathname.startsWith(`${basePath}/`) ? url.pathname.slice(basePath.length) : null
  }

  const prefetch = (link: HTMLAnchorElement) => {
    const path = routePath(link)
    if (path === null || prefetched.has(path) || prefersSavingData()) return
    prefetched.add(path)
    router.preload(path).catch(() => {})
  }

  const onPointerOver = (event: Event) => {
    const link = findLink(event)
    if (!link) return
    clearTimeout(hoverTimer)
    hoverTimer = setTimeout(() => prefetch(link), HOVER_DELAY_MS)
  }
  const onPointerOut = () => clearTimeout(hoverTimer)
  const onImmediateIntent = (event: Event) => {
    const link = findLink(event)
    if (link) prefetch(link)
  }

  document.addEventListener('pointerover', onPointerOver)
  document.addEventListener('pointerout', onPointerOut)
  document.addEventListener('focusin', onImmediateIntent)
  document.addEventListener('touchstart', onImmediateIntent, { passive: true })

  let observer: IntersectionObserver | undefined
  let unsubscribe: (() => void) | undefined
  if (strategy === 'viewport' && typeof IntersectionObserver === 'function') {
    const visibleLinks = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        visibleLinks.unobserve(entry.target)
        prefetch(entry.target as HTMLAnchorElement)
      }
    })
    observer = visibleLinks
    unsubscribe = router.subscribe(() => {
      visibleLinks.disconnect()
      for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href]')) {
        const path = routePath(link)
        if (path !== null && !prefetched.has(path)) visibleLinks.observe(link)
      }
    })
  }

  return () => {
    clearTimeout(hoverTimer)
    document.removeEventListener('pointerover', onPointerOver)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('focusin', onImmediateIntent)
    document.removeEventListener('touchstart', onImmediateIntent)
    observer?.disconnect()
    unsubscribe?.()
  }
}
