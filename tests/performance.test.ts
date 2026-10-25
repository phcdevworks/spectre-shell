import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteContext } from '@phcdevworks/spectre-shell-router'

const preload = vi.fn(async (_path: string) => {})
const destroyed = vi.fn()
const subscribers = new Set<(context: RouteContext) => void>()

vi.mock('@phcdevworks/spectre-shell-router', () => ({
  Router: class {
    preload = preload
    subscribe(callback: (context: RouteContext) => void) {
      subscribers.add(callback)
      return () => { subscribers.delete(callback) }
    }
    destroy() { destroyed() }
  }
}))

vi.mock('../src/styles.js', () => ({}))

function render() {
  const context = { path: '/', params: {}, query: new URLSearchParams(), root: document.body }
  for (const subscriber of [...subscribers]) subscriber(context)
}

function addLink(href: string, attrs: Record<string, string> = {}) {
  const link = document.createElement('a')
  link.href = href
  for (const [key, value] of Object.entries(attrs)) link.setAttribute(key, value)
  document.body.append(link)
  return link
}

const routers: Array<{ destroy: () => void }> = []

async function shell() {
  const mod = await import('../src/index.js')
  const bootstrapApp: typeof mod.bootstrapApp = (options) => {
    const router = mod.bootstrapApp(options)
    routers.push(router)
    return router
  }
  return { ...mod, bootstrapApp }
}

const focus = (el: Element) => el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

beforeEach(() => {
  vi.resetModules()
  preload.mockClear()
  destroyed.mockClear()
  subscribers.clear()
  document.body.innerHTML = ''
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  for (const router of routers.splice(0)) router.destroy()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('prefetch', () => {
  it('is off by default', async () => {
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [] })

    focus(addLink('/about'))

    expect(preload).not.toHaveBeenCalled()
  })

  it('warms a route once when a link receives focus or touch', async () => {
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [], prefetch: 'intent' })
    const link = addLink('/about?tab=1#team')

    focus(link)
    link.dispatchEvent(new Event('touchstart', { bubbles: true }))

    expect(preload).toHaveBeenCalledTimes(1)
    expect(preload).toHaveBeenCalledWith('/about')
  })

  it('warms on hover only after the pointer settles', async () => {
    vi.useFakeTimers()
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [], prefetch: 'intent' })
    const swept = addLink('/swept')
    const settled = addLink('/settled')

    swept.dispatchEvent(new Event('pointerover', { bubbles: true }))
    swept.dispatchEvent(new Event('pointerout', { bubbles: true }))
    settled.dispatchEvent(new Event('pointerover', { bubbles: true }))
    vi.advanceTimersByTime(100)

    expect(preload).toHaveBeenCalledTimes(1)
    expect(preload).toHaveBeenCalledWith('/settled')
  })

  it('ignores links the router would not intercept', async () => {
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [], prefetch: 'intent' })

    focus(addLink('https://example.com/away'))
    focus(addLink('/new-tab', { target: '_blank' }))
    focus(addLink('/file', { download: '' }))
    focus(addLink('/out', { rel: 'external' }))

    expect(preload).not.toHaveBeenCalled()
  })

  it('maps links through basePath and hash mode', async () => {
    const { bootstrapApp } = await shell()
    const router = bootstrapApp({
      root: document.body,
      routes: () => [],
      prefetch: 'intent',
      routerOptions: { basePath: '/app/' }
    })
    focus(addLink('/app/users/7'))
    focus(addLink('/app'))
    focus(addLink('/elsewhere'))
    router.destroy()

    bootstrapApp({
      root: document.body,
      routes: () => [],
      prefetch: 'intent',
      routerOptions: { mode: 'hash' }
    })
    focus(addLink('#/settings?x=1'))
    focus(addLink('#section'))

    expect(preload.mock.calls.map(([path]) => path)).toEqual(['/users/7', '/', '/settings'])
  })

  it('respects the Save-Data preference', async () => {
    vi.stubGlobal('navigator', { ...navigator, connection: { saveData: true } })
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [], prefetch: 'intent' })

    focus(addLink('/about'))

    expect(preload).not.toHaveBeenCalled()
  })

  it('warms links rendered into view in viewport mode', async () => {
    let onIntersect!: IntersectionObserverCallback
    const observed: Element[] = []
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { onIntersect = callback }
      observe(el: Element) { observed.push(el) }
      unobserve() {}
      disconnect() { observed.length = 0 }
    })
    const { bootstrapApp } = await shell()
    bootstrapApp({ root: document.body, routes: () => [], prefetch: 'viewport' })
    const visible = addLink('/visible')
    addLink('https://example.com/away')

    render()
    expect(observed).toEqual([visible])
    onIntersect(
      [{ isIntersecting: true, target: visible } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    )

    expect(preload).toHaveBeenCalledWith('/visible')
  })

  it('removes its listeners when the router is destroyed', async () => {
    const { bootstrapApp } = await shell()
    const router = bootstrapApp({ root: document.body, routes: () => [], prefetch: 'intent' })

    router.destroy()
    focus(addLink('/about'))

    expect(destroyed).toHaveBeenCalledTimes(1)
    expect(preload).not.toHaveBeenCalled()
  })
})

describe('deferred plugins', () => {
  it('installs after the first rendered route at idle time', async () => {
    const idle: Array<() => void> = []
    vi.stubGlobal('requestIdleCallback', (callback: () => void) => idle.push(callback))
    vi.stubGlobal('cancelIdleCallback', () => {})
    const order: string[] = []
    const { bootstrapApp } = await shell()

    bootstrapApp({
      root: document.body,
      routes: () => { order.push('routes'); return [] },
      plugins: [
        { name: 'late', defer: true, install: () => order.push('late') },
        { name: 'early', install: () => order.push('early') }
      ]
    })
    expect(order).toEqual(['early', 'routes'])

    render()
    render()
    expect(idle).toHaveLength(1)
    idle[0]()

    expect(order).toEqual(['early', 'routes', 'late'])
  })

  it('reports a failing deferred plugin without blocking the rest', async () => {
    vi.useFakeTimers()
    const reported = vi.fn()
    vi.stubGlobal('reportError', reported)
    const install = vi.fn()
    const { bootstrapApp, bootReady } = await shell()

    bootstrapApp({
      root: document.body,
      routes: () => [],
      plugins: [
        { name: 'broken', defer: true, install: () => { throw new Error('boom') } },
        { name: 'fine', defer: true, install }
      ]
    })
    render()
    vi.runAllTimers()

    expect(install).toHaveBeenCalledWith({ bootReady })
    expect(reported).toHaveBeenCalledWith(expect.objectContaining({
      message: '[spectre-shell] Deferred plugin "broken" failed: boom'
    }))
  })

  it('cancels a pending install when the router is destroyed', async () => {
    vi.useFakeTimers()
    const install = vi.fn()
    const { bootstrapApp } = await shell()
    const router = bootstrapApp({
      root: document.body,
      routes: () => [],
      plugins: [{ name: 'late', defer: true, install }]
    })

    render()
    router.destroy()
    vi.runAllTimers()

    expect(install).not.toHaveBeenCalled()
  })
})

describe('performance marks', () => {
  it('measures bootstrap and first render', async () => {
    const measure = vi.spyOn(performance, 'measure')
    const { bootstrapApp } = await shell()

    bootstrapApp({ root: document.body, routes: () => [] })
    render()
    render()

    expect(measure.mock.calls.map(([name]) => name)).toEqual([
      'spectre-shell:bootstrap',
      'spectre-shell:first-render'
    ])
    measure.mockRestore()
  })

  it('never lets User Timing failures break startup', async () => {
    vi.spyOn(performance, 'mark').mockImplementation(() => { throw new Error('no timing') })
    const { bootstrapApp, bootReady } = await shell()

    expect(() => bootstrapApp({ root: document.body, routes: () => [] })).not.toThrow()
    expect(bootReady.value).toBe(true)
    vi.restoreAllMocks()
  })
})
