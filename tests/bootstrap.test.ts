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
  it('exposes only the thin bootstrap runtime at the package entrypoint', async () => {
    const shell = await import('../src/index.js')

    expect(Object.keys(shell).sort()).toEqual(['bootstrapApp'])
  })

  beforeEach(() => {
    routerConstructor.mockReset()
    vi.resetModules()
  })

  it('runs route registration before handing off to the router', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const routeDefinitions = [{ path: '/', loader: vi.fn() }]
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => {
        order.push('routes')
        return routeDefinitions
      }
    })

    expect(order).toEqual(['routes'])
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

  it('propagates route registration errors and does not construct the router', async () => {
    const root = document.createElement('div')
    const error = new Error('route setup failed')
    const { bootstrapApp } = await import('../src/index.js')

    expect(() =>
      bootstrapApp({
        root,
        routes: () => {
          throw error
        }
      })
    ).toThrow(error)

    expect(routerConstructor).not.toHaveBeenCalled()
  })
})
