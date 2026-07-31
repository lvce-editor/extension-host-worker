import { context } from 'esbuild'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const external = ['node:buffer', 'node:worker_threads', 'electron', 'ws']
const dist = join(root, '.tmp', 'dist', 'dist')

await mkdir(join(dist, 'extension-api'), { recursive: true })

const extensionApiContext = await context({
  bundle: true,
  entryPoints: [join(root, 'packages', 'extension-api', 'src', 'index.ts')],
  external,
  format: 'esm',
  outfile: join(dist, 'extension-api', 'index.js'),
  platform: 'browser',
})

await extensionApiContext.watch()

console.log('watching extension api')
