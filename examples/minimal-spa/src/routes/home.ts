import type { PageModule, RouteContext } from '@phcdevworks/spectre-shell-router'

export default async function load(): Promise<PageModule> {
  return {
    render(ctx: RouteContext) {
      ctx.root.innerHTML = `
        <main class="sp-stack">
          <h1>Spectre Shell — Minimal SPA</h1>
          <p>This page was rendered by a lazily loaded route module.</p>
          <nav>
            <a href="/about">Go to About</a>
          </nav>
        </main>
      `
    }
  }
}
