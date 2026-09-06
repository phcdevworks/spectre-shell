import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PageModule } from '@phcdevworks/spectre-shell-router'

vi.mock('../dist/styles.js', () => ({}))

describe('package smoke (dist with real router)', () => {
  beforeEach(() => {
    vi.resetModules()
    window.history.replaceState({}, '', '/')
  })

  it('built entrypoint exports bootstrapApp and bootReady', async () => {
    const { bootstrapApp, bootReady } = await import('../dist/index.js')
    expect(typeof bootstrapApp).toBe('function')
    expect(bootReady.value).toBe(false)
  })

  it('signals shell startup before a delayed route renders and forwards navigation hooks', async () => {
    const { bootstrapApp, bootReady } = await import('../dist/index.js')
    const root = document.createElement('div')
    let resolvePage!: (page: PageModule) => void
    const page = new Promise<PageModule>((resolve) => { resolvePage = resolve })
    let finishNavigation!: () => void
    const navigated = new Promise<void>((resolve) => { finishNavigation = resolve })
    const afterNavigate = vi.fn(() => { finishNavigation() })
    const afterMount = vi.fn(() => {
      expect(bootReady.value).toBe(true)
      expect(root.textContent).toBe('')
      expect(afterNavigate).not.toHaveBeenCalled()
    })
    const router = bootstrapApp({
      root,
      routes: () => [{ path: '/', loader: () => page }],
      routerOptions: { scrollRestoration: false, afterNavigate },
      afterMount
    })

    try {
      expect(afterMount).toHaveBeenCalledTimes(1)
      resolvePage({ render: ({ root }) => { root.textContent = 'Rendered' } })
      await navigated
      expect(root.textContent).toBe('Rendered')
      expect(afterNavigate).toHaveBeenCalledTimes(1)
      expect(afterNavigate).toHaveBeenCalledWith(expect.objectContaining({ path: '/', root }))
    } finally {
      router.destroy()
    }
  })

  it('reports a failed restart after a real router is destroyed', async () => {
    const { bootstrapApp, bootReady } = await import('../dist/index.js')
    const root = document.createElement('div')
    const router = bootstrapApp({
      root,
      routes: () => [{ path: '/', loader: async () => ({ render() {} }) }],
      routerOptions: { scrollRestoration: false }
    })
    try {
      expect(bootReady.value).toBe(true)
    } finally {
      router.destroy()
    }

    expect(() => bootstrapApp({
      root,
      routes: () => { throw new Error('restart failed') }
    })).toThrow('[spectre-shell] Bootstrap failed: restart failed')
    expect(bootReady.value).toBe(false)
  })
})
