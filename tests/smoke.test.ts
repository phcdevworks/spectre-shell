import { describe, expect, it, vi } from 'vitest'

vi.mock('@phcdevworks/spectre-shell-router', () => ({
  Router: class {
    constructor() {}
  }
}))

vi.mock('../dist/styles.js', () => ({}))

describe('package smoke (dist)', () => {
  it('built entrypoint exports bootstrapApp and bootReady', async () => {
    const { bootstrapApp, bootReady } = await import('../dist/index.js')
    expect(typeof bootstrapApp).toBe('function')
    expect(typeof bootReady.value).toBe('boolean')
  })

  it('bootstrapApp runs without error from the built output', async () => {
    const { bootstrapApp, bootReady } = await import('../dist/index.js')
    const root = document.createElement('div')
    bootstrapApp({ root, routes: () => [] })
    expect(bootReady.value).toBe(true)
  })
})
