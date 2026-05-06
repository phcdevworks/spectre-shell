import { beforeEach, describe, expect, it, vi } from 'vitest'

const routerConstructor = vi.fn()

vi.mock('@phcdevworks/spectre-shell-router', () => ({
  Router: class {
    constructor(routes: unknown, root: unknown) {
      routerConstructor(routes, root)
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
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root)
  })

  it('delegates to the router exactly once for each bootstrap call', async () => {
    const root = document.createElement('div')
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const routes = vi.fn(() => routeDefinitions)
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes })

    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root)
  })

  it('only coordinates route collection and router handoff', async () => {
    const root = document.createElement('div')
    root.innerHTML = '<p>existing</p>'
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const routes = vi.fn(() => routeDefinitions)
    const { bootstrapApp } = await import('../src/index.js')

    const result = bootstrapApp({ root, routes })

    expect(result).toBeUndefined()
    expect(root.innerHTML).toBe('<p>existing</p>')
    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith(routeDefinitions, root)
  })

  it('passes an empty route list through without adding shell-side routing behavior', async () => {
    const root = document.createElement('div')
    const routes = vi.fn(() => [])
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes })

    expect(routes).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledTimes(1)
    expect(routerConstructor).toHaveBeenCalledWith([], root)
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
