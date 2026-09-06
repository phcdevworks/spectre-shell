import { beforeEach, describe, expect, it, vi } from 'vitest'

const routerConstructor = vi.fn()

vi.mock('@phcdevworks/spectre-shell-router', () => ({
  Router: class {
    constructor(routes: unknown, root: unknown, options: unknown) {
      routerConstructor(routes, root, options)
    }
  }
}))

vi.mock('../src/styles.js', () => ({}))

describe('bootstrapApp', () => {
  beforeEach(() => {
    routerConstructor.mockReset()
    vi.resetModules()
  })

  it('exposes the bootstrap entry point and bootReady signal at the package entrypoint', async () => {
    const shell = await import('../src/index.js')

    expect(Object.keys(shell).sort()).toEqual(['bootReady', 'bootstrapApp'])
  })

  it('returns the Router instance created during bootstrap', async () => {
    const root = document.createElement('div')
    const { bootstrapApp } = await import('../src/index.js')

    const result = bootstrapApp({ root, routes: () => [] })

    expect(result).toBeInstanceOf(Object)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
  })

  it('runs plugin install after beforeMount and before route registration', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const plugin = {
      name: 'test-plugin',
      install: vi.fn(() => order.push('plugin'))
    }
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => { order.push('routes'); return [] },
      beforeMount: () => order.push('beforeMount'),
      plugins: [plugin]
    })

    expect(order).toEqual(['beforeMount', 'plugin', 'routes'])
    expect(plugin.install).toHaveBeenCalledTimes(1)
  })

  it('installs plugins in declaration order and passes bootReady in the context', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const { bootstrapApp, bootReady } = await import('../src/index.js')
    const first = { name: 'first', install: (ctx: { bootReady: typeof bootReady }) => {
      order.push('first')
      expect(ctx.bootReady).toBe(bootReady)
      expect(ctx.bootReady.value).toBe(false)
    } }
    const second = { name: 'second', install: () => order.push('second') }

    bootstrapApp({ root, routes: () => [], plugins: [first, second] })

    expect(order).toEqual(['first', 'second'])
  })

  it('propagates plugin install errors into the bootstrap error boundary', async () => {
    const root = document.createElement('div')
    const cause = new Error('plugin install failed')
    const plugin = { name: 'broken-plugin', install: () => { throw cause } }
    const { bootstrapApp } = await import('../src/index.js')

    expect(() => bootstrapApp({ root, routes: () => [], plugins: [plugin] }))
      .toThrow('[spectre-shell] Bootstrap failed: plugin install failed')
    expect(routerConstructor).not.toHaveBeenCalled()
  })

  it('treats a missing plugins array as a no-op', async () => {
    const root = document.createElement('div')
    const routes = vi.fn(() => [])
    const { bootstrapApp } = await import('../src/index.js')

    expect(() => bootstrapApp({ root, routes })).not.toThrow()
    expect(routes).toHaveBeenCalledTimes(1)
  })

  it('runs route registration before handing off to the router', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    routerConstructor.mockImplementation(() => {
      order.push('router')
    })
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => {
        order.push('routes')
        return routeDefinitions
      }
    })

    expect(order).toEqual(['routes', 'router'])
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root, undefined)
  })

  it('delegates to the router exactly once for each bootstrap call', async () => {
    const root = document.createElement('div')
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const routes = vi.fn(() => routeDefinitions)
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes })

    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root, undefined)
  })

  it('only coordinates route collection and router handoff', async () => {
    const root = document.createElement('div')
    root.innerHTML = '<p>existing</p>'
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const routes = vi.fn(() => routeDefinitions)
    const { bootstrapApp } = await import('../src/index.js')

    const result = bootstrapApp({ root, routes })

    expect(result).toBeDefined()
    expect(root.innerHTML).toBe('<p>existing</p>')
    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root, undefined)
  })

  it('passes an empty route list through without adding shell-side routing behavior', async () => {
    const root = document.createElement('div')
    const routes = vi.fn(() => [])
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes })

    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith([], root, undefined)
  })

  it('forwards router options to the Router constructor', async () => {
    const root = document.createElement('div')
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const routerOptions = {
      onNavigationStart: vi.fn(),
      onNavigationEnd: vi.fn(),
      afterNavigate: vi.fn(),
    }
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes: () => routeDefinitions, routerOptions })

    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root, routerOptions)
  })

  it('wraps initialization errors in a structured bootstrap error', async () => {
    const root = document.createElement('div')
    const cause = new Error('route setup failed')
    const { bootstrapApp } = await import('../src/index.js')

    expect(() =>
      bootstrapApp({
        root,
        routes: () => {
          throw cause
        }
      })
    ).toThrow('[spectre-shell] Bootstrap failed: route setup failed')
    expect(routerConstructor).not.toHaveBeenCalled()
  })

  it('preserves the original error as the cause of the bootstrap error', async () => {
    const root = document.createElement('div')
    const cause = new Error('route setup failed')
    const { bootstrapApp } = await import('../src/index.js')

    let thrown: unknown
    try {
      bootstrapApp({ root, routes: () => { throw cause } })
    } catch (err) {
      thrown = err
    }

    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error).cause).toBe(cause)
  })

  it('sets bootReady to true after successful bootstrap', async () => {
    const root = document.createElement('div')
    const { bootstrapApp, bootReady } = await import('../src/index.js')

    expect(bootReady.value).toBe(false)
    bootstrapApp({ root, routes: () => [] })
    expect(bootReady.value).toBe(true)
  })

  it('does not set bootReady to true when bootstrap fails', async () => {
    const root = document.createElement('div')
    const { bootstrapApp, bootReady } = await import('../src/index.js')

    expect(() =>
      bootstrapApp({ root, routes: () => { throw new Error('fail') } })
    ).toThrow()
    expect(bootReady.value).toBe(false)
  })

  it('resets readiness before hooks and plugins on a subsequent bootstrap', async () => {
    const { bootstrapApp, bootReady } = await import('../src/index.js')
    const root = document.createElement('div')
    bootstrapApp({ root, routes: () => [] })

    const states: boolean[] = []
    bootstrapApp({
      root,
      beforeMount: () => { states.push(bootReady.value) },
      plugins: [{ name: 'observe', install: ({ bootReady }) => { states.push(bootReady.value) } }],
      routes: () => { states.push(bootReady.value); return [] }
    })

    expect(states).toEqual([false, false, false])
    expect(bootReady.value).toBe(true)
  })

  it.each(['beforeMount', 'plugin', 'routes', 'router'])(
    'clears stale readiness when a subsequent bootstrap fails in %s',
    async (stage) => {
      const { bootstrapApp, bootReady } = await import('../src/index.js')
      const root = document.createElement('div')
      bootstrapApp({ root, routes: () => [] })
      const fail = () => { throw new Error('retry failed') }
      if (stage === 'router') routerConstructor.mockImplementation(fail)

      expect(() => bootstrapApp({
        root,
        beforeMount: stage === 'beforeMount' ? fail : undefined,
        plugins: stage === 'plugin' ? [{ name: 'broken', install: fail }] : undefined,
        routes: stage === 'routes' ? fail : () => []
      })).toThrow('[spectre-shell] Bootstrap failed: retry failed')
      expect(bootReady.value).toBe(false)
    }
  )

  it('keeps successful readiness and the original error when afterMount throws', async () => {
    const { bootstrapApp, bootReady } = await import('../src/index.js')
    const cause = new Error('post-startup failure')

    expect(() => bootstrapApp({
      root: document.createElement('div'),
      routes: () => [],
      afterMount: () => { throw cause }
    })).toThrow(cause)
    expect(bootReady.value).toBe(true)
  })

  it('fires beforeMount before route registration', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => { order.push('routes'); return [] },
      beforeMount: () => order.push('beforeMount')
    })

    expect(order).toEqual(['beforeMount', 'routes'])
  })

  it('fires afterMount after router startup with bootReady already set', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const { bootstrapApp, bootReady } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => { order.push('routes'); return [] },
      afterMount: () => { order.push(`afterMount:bootReady=${bootReady.value}`) }
    })

    expect(order).toEqual(['routes', 'afterMount:bootReady=true'])
  })

  it('fires hooks in beforeMount → routes → router → afterMount order', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    routerConstructor.mockImplementation(() => { order.push('router') })
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => { order.push('routes'); return [] },
      beforeMount: () => order.push('beforeMount'),
      afterMount: () => order.push('afterMount')
    })

    expect(order).toEqual(['beforeMount', 'routes', 'router', 'afterMount'])
  })
})
