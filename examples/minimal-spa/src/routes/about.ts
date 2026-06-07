import type { PageModule, RouteContext } from '@phcdevworks/spectre-shell-router'

export default async function load(): Promise<PageModule> {
  return {
    render(ctx: RouteContext) {
      ctx.root.innerHTML = `
        <main class="sp-stack">
          <h1>About</h1>
          <p>Loaded via a second lazy route to demonstrate navigation.</p>
          <nav>
            <a href="/">Back to Home</a>
          </nav>
        </main>
      `
    }
  }
}
