import { build } from 'esbuild'

await Promise.all([
  build({
    entryPoints: ['./in-browser-testing-libs.js'],
    outfile: './index.js',
    bundle: true,
    external: ['node:*'],
    platform: 'browser',
    format: 'esm',
  }),
  build({
    entryPoints: ['./src/index.ts'],
    outfile: './test/e2e/runsInBrowsers/station-client.browser.js',
    bundle: true,
    external: ['node:*'],
    platform: 'browser',
    format: 'esm',
  }),
])
