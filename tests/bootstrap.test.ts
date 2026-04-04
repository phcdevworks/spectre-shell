import { beforeEach, describe, expect, it, vi } from 'vitest'

const startRouter = vi.fn()

vi.mock('@phcdevworks/spectre-shell-router', () => ({
  startRouter
}))

vi.mock('../src/styles.js', () => ({}))

describe('bootstrapApp', () => {
  beforeEach(() => {
    startRouter.mockReset()
    vi.resetModules()
  })

  it('runs route registration before starting the router', async () => {
    const order: string[] = []
    const root = document.createElement('div')
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({
      root,
      routes: () => {
        order.push('routes')
      }
    })

    expect(order).toEqual(['routes'])
    expect(startRouter).toHaveBeenCalledTimes(1)
    expect(startRouter).toHaveBeenCalledWith({ root })
  })

  it('delegates to the router exactly once for each bootstrap call', async () => {
    const root = document.createElement('div')
    const routes = vi.fn()
    const { bootstrapApp } = await import('../src/index.js')

    bootstrapApp({ root, routes })

    expect(routes).toHaveBeenCalledTimes(1)
    expect(startRouter).toHaveBeenCalledTimes(1)
    expect(startRouter).toHaveBeenCalledWith({ root })
  })

  it('only coordinates routes and router startup', async () => {
    const root = document.createElement('div')
    root.innerHTML = '<p>existing</p>'
    const routes = vi.fn()
    const { bootstrapApp } = await import('../src/index.js')

    const result = bootstrapApp({ root, routes })

    expect(result).toBeUndefined()
    expect(root.innerHTML).toBe('<p>existing</p>')
    expect(routes).toHaveBeenCalledTimes(1)
    expect(startRouter).toHaveBeenCalledTimes(1)
  })

  it('propagates route registration errors and does not start the router', async () => {
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

    expect(startRouter).not.toHaveBeenCalled()
  })
})
