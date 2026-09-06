import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '..')
const temp = mkdtempSync(join(tmpdir(), 'spectre-shell-consumer-'))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (args: string[], cwd = temp) => execFileSync(npm, args, { cwd, stdio: 'inherit' })
const version = (name: string) => (JSON.parse(
  readFileSync(join(repoRoot, 'node_modules', name, 'package.json'), 'utf8')
) as { version: string }).version

try {
  run(['pack', '--ignore-scripts', '--pack-destination', temp], repoRoot)
  const tarballs = readdirSync(temp).filter((file) => file.endsWith('.tgz'))
  if (tarballs.length !== 1) throw new Error('Expected exactly one package tarball')
  writeFileSync(join(temp, 'package.json'), JSON.stringify({
    name: 'shell-consumer-check', private: true, type: 'module',
    dependencies: { '@phcdevworks/spectre-shell': `file:./${tarballs[0]}` },
    devDependencies: { typescript: version('@typescript/native'), vite: version('vite') }
  }, null, 2))
  writeFileSync(join(temp, 'index.html'), '<div id="app"></div><script type="module" src="/main.ts"></script>')
  writeFileSync(join(temp, 'main.ts'), `
import { bootstrapApp, bootReady, type BootstrapOptions, type ShellPlugin, type ShellPluginContext, type Router } from '@phcdevworks/spectre-shell'
const plugin: ShellPlugin = { name: 'consumer', install(context: ShellPluginContext) { context.bootReady.value = false } }
const options: BootstrapOptions = {
  root: document.querySelector<HTMLElement>('#app')!,
  routes: () => [{ path: '/', loader: async () => ({ render({ root }) { root.textContent = 'Ready' } }) }],
  plugins: [plugin],
  routerOptions: { afterNavigate({ root }) { root.dataset.ready = String(bootReady.value) } }
}
const router: Router = bootstrapApp(options)
router.subscribe(({ path }) => { document.title = path })
`)
  writeFileSync(join(temp, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', types: ['vite/client'], strict: true, noEmit: true },
    include: ['main.ts']
  }))
  run(['install', '--ignore-scripts', '--no-audit', '--no-fund'])
  run(['exec', '--', 'tsc', '--noEmit'])
  run(['exec', '--', 'vite', 'build'])
  const assets = join(temp, 'dist', 'assets')
  const css = readdirSync(assets).filter((file) => file.endsWith('.css'))
  if (!css.some((file) => readFileSync(join(assets, file), 'utf8').trim().length > 0)) {
    throw new Error('Shell import did not produce a stylesheet in the consumer build')
  }
  console.log('Packed consumer: imports, public types, production build, and shell CSS passed.')
} finally {
  rmSync(temp, { recursive: true, force: true })
}
