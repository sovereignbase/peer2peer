import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const browserScript = resolve(root, 'test', 'e2e', 'runsInBrowsers', 'run.mjs')

console.log('\n=== Browser E2E ===')

const result = spawnSync(process.execPath, [browserScript], {
  stdio: 'inherit',
  cwd: root,
})

if (result.status !== 0) process.exit(result.status ?? 1)

console.log('\nBrowser E2E suite passed.')
