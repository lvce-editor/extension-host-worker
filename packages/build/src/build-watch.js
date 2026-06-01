import { context } from 'esbuild'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.js'

const external = ['node:buffer', 'node:worker_threads', 'electron', 'ws']
const dist = join(root, '.tmp', 'dist', 'dist')

await mkdir(join(dist, 'extension-api'), { recursive: true })

const extensionHostWorkerContext = await context({
  bundle: true,
  entryPoints: [join(root, 'packages', 'extension-host-worker', 'src', 'extensionHostWorkerMain.ts')],
  external,
  format: 'esm',
  outfile: join(dist, 'extensionHostWorkerMain.js'),
  platform: 'browser',
})

const extensionApiContext = await context({
  bundle: true,
  entryPoints: [join(root, 'packages', 'extension-api', 'src', 'index.ts')],
  external,
  format: 'esm',
  outfile: join(dist, 'extension-api', 'index.js'),
  platform: 'browser',
})

await Promise.all([extensionHostWorkerContext.watch(), extensionApiContext.watch()])

console.log('watching extension host worker and extension api')
