import { spawnSync } from 'node:child_process'
import { appendFileSync, readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const outdated = spawnSync(npm, ['outdated', '--json', '--workspaces', '--include-workspace-root'], {
  cwd: root, encoding: 'utf8'
})
if (outdated.error) throw outdated.error
if (outdated.status !== 0 && outdated.status !== 1) {
  throw new Error(`Dependency lookup failed: ${outdated.stderr}`)
}
const packages = JSON.parse(outdated.stdout || '{}') as Record<string, unknown>
if ('error' in packages) throw new Error(`Dependency lookup failed: ${outdated.stdout}`)
const lines = [
  '# Dependency maintenance report', '',
  '## npm packages', '',
  Object.keys(packages).length ? '```json\n' + JSON.stringify(packages, null, 2) + '\n```' : 'No outdated packages reported.',
  '', '## Workflow actions', '',
  '| Action | Configured ref | Latest release |', '| --- | --- | --- |'
]
const workflowDir = join(root, '.github', 'workflows')
const refs = new Set<string>()
for (const file of readdirSync(workflowDir).filter((name) => /\.ya?ml$/.test(name))) {
  const contents = readFileSync(join(workflowDir, file), 'utf8')
  for (const match of contents.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@([\w.-]+)/g)) {
    refs.add(`${match[1]}@${match[2]}`)
  }
}
for (const ref of [...refs].sort()) {
  const [repository, configured] = ref.split('@')
  const result = spawnSync('gh', ['api', `repos/${repository}/releases/latest`, '--jq', '.tag_name'], {
    cwd: root, encoding: 'utf8'
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Action release lookup failed for ${repository}: ${result.stderr}`)
  lines.push(`| ${repository} | ${configured} | ${result.stdout.trim()} |`)
}
lines.push('', 'Review release notes before changing versions. Validate updates with `npm run check`,',
  'the example typecheck, and the example build. Commit with the configured human',
  'identity and push directly to `main`; this report creates no branches or pull requests.', '')
const report = lines.join('\n')
console.log(report)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report)
